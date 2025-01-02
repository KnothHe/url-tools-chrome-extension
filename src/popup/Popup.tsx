import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { getURLParameters, removeUTMParameters } from "@/utils/urlParser";

function Popup() {
  const [url, setUrl] = useState("");
  const [paramRecord, setParamRecord] = useState<Record<string, string>>({});

  function handleParse() {
    const parsedRecord: Record<string, string> = getURLParameters(url);
    if (parsedRecord) {
      setParamRecord(parsedRecord);
    }
  }

  function getModifiedURL() {
    try {
      const parsedURL = new URL(url);
      const searchParams = new URLSearchParams();
      Object.entries(paramRecord).forEach(([key, value]) => {
        searchParams.set(key, value);
      });

      parsedURL.search = searchParams.toString();
      return parsedURL.toString();
    } catch (error) {
      console.error("Invalid URL:", error);
      return "";
    }
  }

  function handleCopyURL() {
    const modifiedURL = getModifiedURL();
    if (modifiedURL) {
      navigator.clipboard.writeText(modifiedURL);
    }
  }

  function handleRemoveUTMParameters() {
    if (url) {
      const noUtmParams: Record<string, string> = removeUTMParameters(url);
      setParamRecord(noUtmParams);
      const searchParams = new URLSearchParams();
      Object.entries(noUtmParams).forEach(([key, value]) => {
        searchParams.set(key, value);
      });

      const parsedURL = new URL(url);
      parsedURL.search = searchParams.toString();
      return parsedURL.toString();
    }
  }

  return (
    <>
      <div className="w-[600px] w-max-[800px] h-max[600px] bg-white p-4 rounded-lg shadow-lg">
        <div className="flex flex-row items-center space-x-4">
          <Input
            className="border p-2 rounded text-gray-700 flex-1"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
            className="bg-black text-white hover:bg-gray-700 flex-shrink-0"
            onClick={handleParse}
          >
            Parse
          </Button>
        </div>
        <div className="mt-4 max-h-[300px] overflow-auto">
          {Object.entries(paramRecord).map(([key, value]) => (
            <div
              key={key}
              className="flex flex-row items-center space-x-2 mb-2"
            >
              <div className="flex flex-row items-center space-x-2 w-full bg-gray-50 p-2 rounded-lg shadow-sm">
                <div
                  className="w-1/5 text-left truncate bg-gray-200 border border-gray-300 p-1 rounded"
                  title={key}
                >
                  <span className="font-semibold">{key}</span>
                </div>
                <div
                  className="w-4/5 text-left truncate bg-gray-200 border border-gray-300 p-1 rounded"
                  title={value}
                >
                  <span>{value}</span>
                </div>
                <Button
                  className="bg-black text-white hover:bg-gray-700 flex-shrink-0 ml-2"
                  onClick={() => {
                    const newParamRecord = { ...paramRecord };
                    delete newParamRecord[key];
                    setParamRecord(newParamRecord);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-row items-center space-x-4">
          <div className="bg-gray-100 p-2 rounded-lg shadow-sm text-nowrap overflow-auto flex-1">
            <span className="break-all block w-full">{getModifiedURL()}</span>
          </div>
          <Button
            className="bg-black text-white hover:bg-gray-700 flex-shrink-0"
            onClick={handleCopyURL}
          >
            Copy URL
          </Button>
        </div>
        <div className="mt-4 flex flex-row items-center justify-between space-x-4">
          <Button
            className="bg-black text-white hover:bg-gray-700 flex-shrink-0"
            onClick={handleRemoveUTMParameters}
          >
            Remove UTM
          </Button>
          <Button
            className="bg-black text-white hover:bg-gray-700 flex-shrink-0"
            onClick={() => {
              const modifiedURL = getModifiedURL();
              if (modifiedURL) {
                chrome.tabs.update({ url: modifiedURL });
              }
            }}
          >
            Open in Current Tab
          </Button>
          <Button
            className="bg-black text-white hover:bg-gray-700 flex-shrink-0"
            onClick={() => {
              const modifiedURL = getModifiedURL();
              if (modifiedURL) {
                chrome.tabs.create({ url: modifiedURL });
              }
            }}
          >
            Open in New Tab
          </Button>
        </div>
      </div>
    </>
  );
}

export default Popup;
