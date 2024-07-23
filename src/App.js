import "./App.css";
import { NuvoImporter } from "nuvo-react";
import OneSchemaImporter from "@oneschema/react";
import { useState } from "react";
function App() {
  const columns = [
    {
      key: "account_number",
      label: "Account Number",
      description: "An integer representing the account number.",
      columnType: "int",
    },
    {
      key: "account_name",
      label: "Account Name",
      description: "Name of the account.",
      columnType: "string",
    },
    {
      key: "property",
      label: "Property",
      description: "The property identifier.",
      columnType: "string",
    },
    {
      key: "property_name",
      label: "Property Name",
      description: "The name of the property.",
      columnType: "string",
    },
    {
      key: "date",
      label: "Date",
      description: "The date of the transaction.",
      columnType: "date",
      outputFormat: "DD/MM/YYYY",
    },
    {
      key: "period",
      label: "Period",
      description: "The period in the format MM-YYYY.",
      columnType: "string",
    },
    {
      key: "person_description",
      label: "Person/Description",
      description: "Description of the person or transaction.",
      columnType: "string",
    },
    {
      key: "control",
      label: "Control",
      description: "Control information for the transaction.",
      columnType: "string",
    },
    {
      key: "reference",
      label: "Reference",
      description: "Reference number for the transaction.",
      columnType: "string",
    },
    {
      key: "debit",
      label: "Debit",
      description: "Debit amount in USD.",
      columnType: "float",
    },
    {
      key: "credit",
      label: "Credit",
      description: "Credit amount in USD.",
      columnType: "float",
    },
    {
      key: "balance",
      label: "Balance",
      description: "Balance amount in USD after the transaction.",
      columnType: "float",
    },
    {
      key: "remarks",
      label: "Remarks",
      description: "Additional remarks or notes.",
      columnType: "string",
    },
  ];

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
    <div style={{ display: "flex", width: "100%", flexDirection: "row", justifyContent: "center" }}>
      <div style={{ width: "50%" }}>
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
      <div style={{ width: "50%" }}>
        <h1>Nuvo</h1>
        <NuvoImporter
          licenseKey='QxmpULuHeozipxTfAa77ROhkSG7QYqAVYnbHp7IUx1k='
          settings={{
            developerMode: true,
            identifier: "product_data",
            allowManualInput: true,
            columns,
          }}
          dataHandler={{
            headerStep: async (_modifier, data) => {
              let sheetData = data[0].data;
              let newData = [];

              let period = "";
              let current_account_number = "";
              let current_account_name = "";
              // Extract period from the 3rd row
              let periodString = String(sheetData[2][0]);
              period = periodString.split("=")[1].trim();
              let [month, year] = period.split(" ");
              let monthNumber = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1;
              period = (monthNumber < 10 ? "0" : "") + monthNumber + "-" + year;

              // Add header row
              newData.push(["Account Number", "Account Name", "Property", "Property Name", "Date", "Period", "Person/Description", "Control", "Reference", "Debit", "Credit", "Balance", "Remarks"]);

              // Start processing rows from row 7 (index 6)
              for (let i = 6; i < sheetData.length; i++) {
                const row = sheetData[i];

                if (row.length > 0 && row[0] && !isNaN(Number(row[0]))) {
                  current_account_number = String(row[0]);
                  current_account_name = String(row[4] || "");
                  continue;
                }

                if (row.length > 0 && row[5] && row[5].toString().trim() !== "") {
                  newData.push([
                    current_account_number, // Account Number
                    current_account_name, // Account Name
                    row[0], // Property
                    row[1], // Property Name
                    row[2], // Date
                    period, // Period
                    row[4], // Person/Description
                    row[5], // Control
                    row[6], // Reference
                    row[7], // Debit
                    row[8], // Credit
                    row[9], // Balance
                    row[10], // Remarks
                  ]);
                }
              }

              data[0].data = newData;

              return data;
            },
          }}
          onResults={(result, errors, complete) => {
            console.log("Errors: ", errors);
            complete();
          }}
        />
      </div>
    </div>
  );
}

export default App;
