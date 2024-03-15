import { Code } from "bright";
import React from "react";

import { CopyButton } from "~/components/copy-button";

const codeToCopy = `<form 
  action="url" method="POST"
  enctype="multipart/form-data"
>
  <input type="text" name="_gotcha" style="display:none" />
  // Add your form fields here, we will use 3 fields as an example
  <input type="text" name="name" placeholder="Name" required />
  <input type="email" name="email" placeholder="Email" required />
  <textarea name="message" placeholder="Message" required></textarea>
  <button type="submit">Submit</button>
</form>`;

const SetUpPage = ({ formId }: { formId: string }) => {
  const codeToDisplay = codeToCopy.replace(
    "url",
    `https://formbase.dev/s/${formId}`,
  );

  return (
    <div className="mt-5">
      <span className="text-xl font-medium">Setup</span>
      <p className="text-muted-foreground">
        Copy and paste the following code into your website to embed your form.
      </p>

      <div className="relative mt-5 rounded-lg">
        <Code
          lang="html"
          // title="file.ext"
          lineNumbers
          theme="github-dark"
          style={{ overflow: "auto", fontFamily: "JetBrains Mono" }}
        >
          {codeToDisplay}
        </Code>

        <CopyButton
          text={codeToDisplay}
          className="absolute right-3 top-3 text-white"
        />
      </div>

      <span className="mt-3 text-sm text-muted-foreground">
        Having trouble?{" "}
        <a href="mailto:hi@eightlabs.xyz" className="cursor-pointer underline">
          Contact us
        </a>
      </span>
    </div>
  );
};

export default SetUpPage;
