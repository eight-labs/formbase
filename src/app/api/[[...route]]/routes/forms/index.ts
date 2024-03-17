import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { validator } from "hono/validator";

import { generateId } from "~/lib/utils/generate-id";
import { db } from "~/server/db";
import { forms } from "~/server/db/schema";

import { CreateFormInputSchema, UpdateFormInputSchema } from "./schema";
import { type Variables } from "../../route";

const app = new Hono<{ Variables: Variables }>();

app.get("/", async (c) => {
  const userId = c.get("userId");

  const userForms = await db
    .select()
    .from(forms)
    .where(eq(forms.userId, userId));

  const transformedForms = userForms.map((form) => {
    return {
      id: form.id,
      title: form.title,
      description: form.description,
      createdAt: form.createdAt,
    };
  });

  return c.json({
    forms: transformedForms,
  });
});

app.post(
  "/",
  validator("json", (value, c) => {
    const parsed = CreateFormInputSchema.safeParse(value);

    if (!parsed.success) {
      return c.json(
        {
          error: parsed.error.errors,
        },
        400,
      );
    }

    return parsed.data;
  }),
  async (c) => {
    const data = c.req.valid("json");

    const id = generateId(15);

    await db.insert(forms).values({
      id,
      userId: c.get("userId"),
      ...data,
      keys: [""],
    });

    return c.json({
      form: {
        id,
        ...data,
      },
    });
  },
);

app.get("/:id", async (c) => {
  const id = c.req.param("id");

  const formDataWithSubmissions = await db.query.forms.findMany({
    where: (table, { and }) =>
      and(eq(table.id, id), eq(table.userId, c.get("userId"))),
    orderBy: (table, { desc }) => desc(table.createdAt),
    columns: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
    },
    with: {
      formData: {
        columns: { data: true, createdAt: true },
      },
    },
  });

  return c.json({
    form: formDataWithSubmissions,
  });
});

app.patch(
  "/:id",
  validator("json", (value, c) => {
    const parsed = UpdateFormInputSchema.safeParse(value);

    if (!parsed.success) {
      return c.json(
        {
          error: parsed.error.errors,
        },
        400,
      );
    }

    return parsed.data;
  }),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");

    const form = await db.query.forms.findFirst({
      where: (table, { and }) =>
        and(eq(table.id, id), eq(table.userId, c.get("userId"))),
    });

    if (!form) {
      return c.notFound();
    }

    await db
      .update(forms)
      .set({
        ...data,
      })
      .where(eq(forms.id, id));

    return c.json({
      form: {
        ...data,
        id,
      },
    });
  },
);

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");

  const form = await db.query.forms.findFirst({
    where: (table, { and }) => and(eq(table.id, id), eq(table.userId, userId)),
  });

  if (!form) return c.notFound();

  await db.delete(forms).where(eq(forms.id, id));

  return c.json({});
});

export const publicFormRouter = app;
