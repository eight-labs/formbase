import { api } from "~/trpc/server";

export default async function FormPage({ params }: { params: { id: string } }) {
  const formSubmissions = await api.formData.all.query({ formId: params.id });

  return (
    <div>
      <div>My Form Id: {params.id}</div>
      <div>My Submittions</div>

      <div>
        {formSubmissions.map((f) => {
          return <div key={f.id}>{JSON.stringify(f.data as string)}</div>;
        })}
      </div>
    </div>
  );
}
