import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  loadInitialSettings,
  addUTMParam,
  saveSettings,
  updateJsonView,
  editJson,
  OptionSetting,
} from "@/utils/optionsService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Copy, Plus, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import i18n from "@/i18n";

function Options() {
  const { theme, setTheme } = useTheme();
  const [utmParams, setUtmParams] = useState<string[]>([]);
  const [lang, setLang] = useState("en");
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(theme);
  const [newParam, setNewParam] = useState("");
  const [jsonView, setJsonView] = useState("");
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  // Load initial settings
  useEffect(() => {
    loadInitialSettings().then((optionSetting) => {
      if (optionSetting.lang) {
        i18n.changeLanguage(optionSetting.lang);
        setLang(optionSetting.lang);
      }
      if (optionSetting.theme) {
        setTheme(optionSetting.theme);
        setCurrentTheme(optionSetting.theme);
      }
      if (optionSetting.utmParams) {
        setUtmParams(optionSetting.utmParams);
        setJsonView(updateJsonView(optionSetting.utmParams));
      }
    });
  }, []);

  // Update JSON view when UTM params change
  useEffect(() => {
    setJsonView(updateJsonView(utmParams));
  }, [utmParams]);

  const handleAddParam = async () => {
    if (newParam.trim()) {
      const updatedParams = await addUTMParam(utmParams, newParam.trim());
      setUtmParams(updatedParams);
      setNewParam("");
    }
  };

  const handleSave = async () => {
    const optionSetting: OptionSetting = { utmParams, lang, theme: currentTheme };
    i18n.changeLanguage(lang);
    setTheme(currentTheme);
    saveSettings(optionSetting).then(() => alert(t("options.saveSuccess")));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-6 text-foreground underline">
          {t("options.title")}
        </h1>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{t("options.themeLabel")}</Label>
          <Select
            value={currentTheme}
            onValueChange={(newTheme: "light" | "dark") => {
              setCurrentTheme(newTheme);
              setTheme(newTheme);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  {t("options.themeLight")}
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  {t("options.themeDark")}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("options.languageLabel")}</Label>
          <Select
            value={lang}
            onValueChange={(newLang) => {
              setLang(newLang);
              i18n.changeLanguage(newLang);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="zh-CN">中文</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Label>{t("options.jsonLabel")}</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  <p className="text-sm">{t("options.jsonTooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-start gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Textarea
                    value={jsonView}
                    readOnly
                    className="mt-2 h-32 font-mono text-sm flex-1"
                  />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  <p className="text-sm">{t("options.formatTooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex flex-col gap-1">
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-2"
                    onClick={() => setEditValue(jsonView)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="mt-2">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("options.addParam.title")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        value={newParam}
                        onChange={(e) => setNewParam(e.target.value)}
                        placeholder={t("options.addParam.placeholder")}
                      />
                      <Button
                        onClick={handleAddParam}
                        disabled={!newParam.trim()}
                      >
                        {t("options.addParam.button")}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-2"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(jsonView);
                    } catch (error) {
                      console.log("Failed to copy:", error);
                    }
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("options.editJson.title")}</DialogTitle>
                  </DialogHeader>
                  <Textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-48 font-mono text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      {t("options.editJson.cancel")}
                    </Button>
                    <Button
                      onClick={() => {
                        try {
                          const parsed = editJson(editValue);
                          setUtmParams(parsed);
                          setJsonView(updateJsonView(parsed));
                          setIsEditing(false);
                        } catch (error: unknown) {
                          if (error instanceof Error) {
                            console.log(error.message);
                          } else {
                            console.log("An unknown error occurred");
                          }
                        }
                      }}
                    >
                      {t("options.editJson.save")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button className="w-full" onClick={handleSave}>
          {t("options.saveButton")}
        </Button>
      </div>
    </div>
  );
}

export default Options;
