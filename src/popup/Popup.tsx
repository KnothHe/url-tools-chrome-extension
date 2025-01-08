import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  loadUTMParams,
  getCurrentTabURL,
  getClipboardURL,
  generateModifiedURL,
  removeUTMParams,
  copyToClipboard,
  openURLInCurrentTab,
  openURLInNewTab,
  openOptionsPage,
} from "@/utils/popupService";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { getURLParameters } from "@/utils/urlParser";
import { useEffect, useState, useCallback } from "react";
import {
  Trash2,
  Copy,
  FilterX,
  ExternalLink,
  PlusSquare,
  Link,
  Clipboard,
  Settings,
} from "lucide-react";

function Popup() {
  const [url, setUrl] = useState("");
  const [paramRecord, setParamRecord] = useState<Record<string, string>>({});
  const [utmParams, setUtmParams] = useState<string[]>([]);

  useEffect(() => {
    loadUTMParams().then(setUtmParams);
  }, []);

  const handleParse = useCallback(async () => {
    if (url) {
      try {
        const parsedRecord = getURLParameters(url);
        setParamRecord(parsedRecord);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log("Failed to parse URL:", error.message);
        } else {
          console.log("Failed to parse URL");
        }
      }
    }
  }, [url]);

  useEffect(() => {
    handleParse();
  }, [url, handleParse]);

  const handlePasteCurrentURL = async () => {
    try {
      const currentURL = await getCurrentTabURL();
      setUrl(currentURL);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardURL = await getClipboardURL();
      setUrl(clipboardURL);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  const getModifiedURL = () => {
    try {
      return generateModifiedURL(url, paramRecord);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred");
      }
      return "";
    }
  };

  const handleCopyURL = async () => {
    const modifiedURL = getModifiedURL();
    if (modifiedURL) {
      try {
        await copyToClipboard(modifiedURL);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log("Failed to copy URL:", error.message);
        } else {
          console.log("Failed to copy URL");
        }
      }
    }
  };

  const handleRemoveUTMParameters = () => {
    if (url) {
      try {
        const modifiedURL = removeUTMParams(url, utmParams);
        const parsedRecord = getURLParameters(modifiedURL);
        setParamRecord(parsedRecord);
        return modifiedURL;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log("Failed to remove UTM parameters:", error.message);
        } else {
          console.log("Failed to remove UTM parameters");
        }
      }
    }
  };

  return (
    <>
      <TooltipProvider>
        <div className="w-[600px] w-max-[800px] h-max[600px] bg-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">URL Tools</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openOptionsPage()}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
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
                  size="icon"
                  onClick={handlePasteCurrentURL}
                >
                  <Link className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Paste current page URL</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-black text-white hover:bg-gray-700 flex-shrink-0"
                  size="icon"
                  onClick={handlePasteFromClipboard}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Paste URL from clipboard</p>
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
                        size="icon"
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
                  size="icon"
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
                  size="icon"
                  onClick={async () => {
                    const modifiedURL = getModifiedURL();
                    if (modifiedURL) {
                      openURLInCurrentTab(modifiedURL);
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
                  size="icon"
                  onClick={async () => {
                    const modifiedURL = getModifiedURL();
                    if (modifiedURL) {
                      openURLInNewTab(modifiedURL);
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
                  size="icon"
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
