
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/context/user-context";
import { useTranslations } from "@/hooks/use-translations";
import type { LanguageKey } from "@/lib/translations";


export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const { firstName, setFirstName, language, setLanguage } = useUser();
  const t = useTranslations();

  const [localFirstName, setLocalFirstName] = useState(firstName);
  const [localLanguage, setLocalLanguage] = useState<LanguageKey>(language);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLocalFirstName(firstName);
  }, [firstName]);

  useEffect(() => {
    setLocalLanguage(language);
  }, [language]);


  const handleSave = (type: 'profile' | 'preferences') => {
    if (type === 'profile') {
      setFirstName(localFirstName);
       toast({
        title: t.settings.settingsSaved,
        description: t.settings.settingsUpdated(t.settings.profileSettings),
      })
    }
    
    if (type === 'preferences') {
      setLanguage(localLanguage);
      toast({
        title: t.settings.settingsSaved,
        description: t.settings.settingsUpdated(t.settings.preferences),
      })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t.settings.title} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.profileTitle}</CardTitle>
              <CardDescription>{t.settings.profileDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">{t.settings.firstName}</Label>
                  <Input 
                    id="first-name"
                    value={localFirstName}
                    onChange={(e) => setLocalFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">{t.settings.lastName}</Label>
                  <Input id="last-name" defaultValue="User" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t.settings.email}</Label>
                <Input id="email" type="email" defaultValue="admin@rulewise.app" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSave('profile')}>{t.settings.saveProfile}</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.settings.preferencesTitle}</CardTitle>
              <CardDescription>{t.settings.preferencesDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="theme">{t.settings.theme}</Label>
                {mounted ? (
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme">
                      <SelectValue placeholder={t.settings.selectTheme} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{t.settings.light}</SelectItem>
                      <SelectItem value="dark">{t.settings.dark}</SelectItem>
                      <SelectItem value="system">{t.settings.system}</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Skeleton className="h-10 w-full" />
                )}
              </div>
               <div className="space-y-2">
                <Label htmlFor="language">{t.settings.language}</Label>
                <Select value={localLanguage} onValueChange={(value) => setLocalLanguage(value as LanguageKey)}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder={t.settings.selectLanguage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                    <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                    <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                    <SelectItem value="ko">한국어 (Korean)</SelectItem>
                    <SelectItem value="zh">中文 (Chinese)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
             <CardFooter>
              <Button onClick={() => handleSave('preferences')}>{t.settings.savePreferences}</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
