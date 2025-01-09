import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
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
  loadInitialSettings
} from "@/utils/optionsService";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { getURLParameters } from "@/utils/urlParser";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from 'react-i18next';
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
import { useTheme } from "@/context/ThemeProvider";

function Popup() {
  const { t } = useTranslation();
  const { setTheme } = useTheme();
  const [url, setUrl] = useState("");
  const [paramRecord, setParamRecord] = useState<Record<string, string>>({});
  const [utmParams, setUtmParams] = useState<string[]>([]);

  useEffect(() => {
    loadInitialSettings().then(
      (optionSetting) => {
        setUtmParams(optionSetting.utmParams);
        setTheme(optionSetting.theme);
      }
    );
  }, [setTheme]);

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
        <div className="w-[600px] w-max-[800px] h-max[600px] bg-background p-4 rounded-lg shadow-lg border border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">{t('popup.title')}</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openOptionsPage()}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex flex-row items-center space-x-4">
            <Input
            className="border p-2 rounded text-foreground flex-1"
              placeholder={t('popup.inputPlaceholder')}
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
                <p>{t('popup.tooltips.pasteCurrent')}</p>
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
                <p>{t('popup.tooltips.pasteClipboard')}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="mt-4 max-h-[300px] overflow-auto">
            {Object.entries(paramRecord).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-row items-center space-x-2 mb-2"
              >
                <div className="flex flex-row items-center space-x-2 w-full bg-background p-2 rounded-lg shadow-sm border border-border">
                  <div
                    className="w-1/3 text-left truncate bg-muted border border-input p-1 rounded"
                    title={key}
                  >
                    <span className="font-semibold">{key}</span>
                  </div>
                  <div
                    className="w-2/3 text-left truncate bg-muted border border-input p-1 rounded"
                    title={value}
                  >
                    <span>{value}</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0 ml-2"
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
                      <p>{t('popup.tooltips.removeParam')}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-row items-center space-x-4">
            <div className="bg-background p-2 rounded-lg shadow-sm text-nowrap overflow-auto flex-1 border border-border">
              <span className="break-all block w-full">{getModifiedURL()}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-row items-center justify-end gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
                  size="icon"
                  onClick={handleRemoveUTMParameters}
                >
                  <FilterX className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('popup.tooltips.removeUTM')}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
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
                <p>{t('popup.tooltips.openCurrent')}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
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
                <p>{t('popup.tooltips.openNew')}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
                  size="icon"
                  onClick={handleCopyURL}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('popup.tooltips.copyURL')}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}

export default Popup;

