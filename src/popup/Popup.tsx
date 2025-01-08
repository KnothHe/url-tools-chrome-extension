import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import {
  Search,
  Trash2,
  Copy,
  FilterX,
  ExternalLink,
  PlusSquare,
} from "lucide-react";
import { getURLParameters, removeUTMParameters } from "@/utils/urlParser";

function Popup() {
  const [url, setUrl] = useState("");
  const [paramRecord, setParamRecord] = useState<Record<string, string>>({});
  const [utmParams, setUtmParams] = useState<string[]>([]);

  useEffect(() => {
    chrome.storage.local.get(["utmParams"], (result) => {
      if (result.utmParams) {
        setUtmParams(result.utmParams);
      }
    });
  }, []);

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
      const noUtmParams: Record<string, string> = removeUTMParameters(
        url,
        utmParams
      );
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
      <TooltipProvider>
        <div className="w-[600px] w-max-[800px] h-max[600px] bg-white p-4 rounded-lg shadow-lg">
          <div className="flex flex-row items-center space-x-4">
            <Input
              className="border p-2 rounded text-gray-700 flex-1"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-black text-white hover:bg-gray-700 flex-shrink-0"
                  onClick={handleParse}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Parse URL parameters</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="mt-4 max-h-[300px] overflow-auto">
            {Object.entries(paramRecord).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-row items-center space-x-2 mb-2"
              >
                <div className="flex flex-row items-center space-x-2 w-full bg-gray-50 p-2 rounded-lg shadow-sm">
                  <div
                    className="w-1/3 text-left truncate bg-gray-200 border border-gray-300 p-1 rounded"
                    title={key}
                  >
                    <span className="font-semibold">{key}</span>
                  </div>
                  <div
                    className="w-2/3 text-left truncate bg-gray-200 border border-gray-300 p-1 rounded"
                    title={value}
                  >
                    <span>{value}</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="bg-black text-white hover:bg-gray-700 flex-shrink-0 ml-2"
                        onClick={() => {
                          const newParamRecord = { ...paramRecord };
                          delete newParamRecord[key];
                          setParamRecord(newParamRecord);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove parameter</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-row items-center space-x-4">
            <div className="bg-gray-100 p-2 rounded-lg shadow-sm text-nowrap overflow-auto flex-1">
              <span className="break-all block w-full">{getModifiedURL()}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-row items-center justify-end gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-black text-white hover:bg-gray-700 flex-shrink-0"
                  onClick={handleRemoveUTMParameters}
                >
                  <FilterX className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove UTM parameters</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-black text-white hover:bg-gray-700 flex-shrink-0"
                  onClick={() => {
                    const modifiedURL = getModifiedURL();
                    if (modifiedURL) {
                      chrome.tabs.update({ url: modifiedURL });
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open in current tab</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-black text-white hover:bg-gray-700 flex-shrink-0"
                  onClick={() => {
                    const modifiedURL = getModifiedURL();
                    if (modifiedURL) {
                      chrome.tabs.create({ url: modifiedURL });
                    }
                  }}
                >
                  <PlusSquare className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open in new tab</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-black text-white hover:bg-gray-700 flex-shrink-0"
                  onClick={handleCopyURL}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy modified URL</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}

export default Popup;
