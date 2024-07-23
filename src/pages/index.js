import Link from "next/link";
import OneSchemaImporter from "@oneschema/react";
import { useState } from "react";
export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const onLaunched = () => {
    console.log("Launched");
  };
  const onSuccess = (result) => {
    console.log("Success", result);
  };
  const onCancel = () => {
    console.log("Cancelled");
  };
  const onError = (error) => {
    console.log("Error", error);
  };
  return (
    <div style={{ display: "flex", width: "100%", flexDirection: "row" }}>
      <div>
        <h1>One Schema</h1>
        <div>
          <button onClick={() => setIsOpen(true)}>Import</button>

          <OneSchemaImporter
            /* managing state from your application */
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            /* required config values */
            clientId='434b0d9f-0368-47e8-8ecc-3006928aadaf'
            userJwt='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI0MzRiMGQ5Zi0wMzY4LTQ3ZTgtOGVjYy0zMDA2OTI4YWFkYWYiLCJ1c2VyX2lkIjoiPFVTRVJfSUQ-In0.t9MyW9-5PKnYituAgWBlaosMQA4bx7RfRINePH75i8k'
            templateKey='cash_detail'
            /* optional config values */
            importConfig={{ type: "local" }}
            devMode={true}
            className='oneschema-importer'
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 1000,
            }}
            /* handling results */
            onLaunched={onLaunched}
            onSuccess={onSuccess}
            onCancel={onCancel}
            onError={onError}
          />
        </div>
      </div>
      <div style={{ display: "flex" }}></div>
    </div>
  );
}
