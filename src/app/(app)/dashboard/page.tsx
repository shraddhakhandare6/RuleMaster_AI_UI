
"use client";

import { CopilotKit, useCopilotChat } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useState } from "react";
import { INSTRUCTIONS } from "../../../app/instructions";
import { SpreadsheetData } from "../../../app/types";
import { sampleData, sampleData2 } from "../../../app/utils/sampleData";
import Sidebar from "../../../components/copilot/Sidebar";
import SingleSpreadsheet from "../../../components/copilot/SingleSpreadsheet";
import { ThemeProvider } from "../../../components/copilot/ThemeProvider";

const App = () => {

  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetData[]>([
    {
      title: "Sample",
      rows: sampleData,
    },
    {
      title: "Projects",
      rows: sampleData2,
    },
    {
      title: "Third",
      rows: [
        [
          { value: "A" },
          { value: "B" },
          { value: "C" },
        ],
        [
          { value: "1" },
          { value: "2" },
          { value: "3" },
        ],
      ]
    }
  ]);
  const [selectedSpreadsheetIndex, setSelectedSpreadsheetIndex] =
    useState<number>(0);

  return (
    <ThemeProvider>
      <CopilotKit runtimeUrl="/api/copilotkit/">
        <div className="flex h-screen">
          <Sidebar
            spreadsheets={spreadsheets}
            selectedSpreadsheetIndex={selectedSpreadsheetIndex}
            setSelectedSpreadsheetIndex={setSelectedSpreadsheetIndex}
          />
          <SingleSpreadsheet
            spreadsheet={spreadsheets[selectedSpreadsheetIndex]}
            setSpreadsheet={(spreadsheet: SpreadsheetData) => {
              const newSpreadsheets = [...spreadsheets];
              newSpreadsheets[selectedSpreadsheetIndex] = spreadsheet;
              setSpreadsheets(newSpreadsheets);
            }}
            spreadSheets={spreadsheets}
            selectedSpreadsheetIndex={selectedSpreadsheetIndex}
            setSelectedSpreadsheetIndex={setSelectedSpreadsheetIndex}
          />
        </div>
        <CopilotSidebar
          instructions={INSTRUCTIONS}
          defaultOpen={true}
          labels={{
            title: "Spreadsheet Copilot",
            initial: "Hi! I can help you create and edit spreadsheets.",
          }}
        >
        </CopilotSidebar>
      </CopilotKit>
    </ThemeProvider>
  );
};

export default App;
