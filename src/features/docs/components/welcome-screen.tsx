/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import Feature from "@/features/docs/components/feature";
import { useDocumentDialog } from "@/features/docs/hooks/use-document-dialog";
import LanguageSwitcher from "@/i18n/language-switcher";
import { useClerk } from "@clerk/nextjs";
import { CameraIcon, MessageCircleIcon, Users2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

const WelcomeScreen = () => {
  const { openSignIn } = useClerk();
  const { t } = useTranslation();
  const { onOpen: openDocument } = useDocumentDialog();
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-8 ">
        <div className="max-w-md flex items-center justify-center flex-col text-center ">
          <div className="text-4xl font-black text-primary tracking-tight">
            circles
          </div>

          <h1 className="text-xl text-muted-foreground font-bold mb-8 leading-tight">
            {t("sidebar:slogan")}
          </h1>

          <p className="text-lg mb-10 opacity-95 leading-relaxed">
            {t("users:subtitle")}
          </p>

          <Button
            onClick={() => openSignIn()}
            className=" text-primary hover:text-primary border-primary cursor-pointer font-semibold px-10 py-4 rounded-full text-lg shadow-2xl  transition-all duration-300"
            variant="outline"
          >
            {t("users:signIn")}
          </Button>
          <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm">
            <Feature
              icon={Users2Icon}
              text={t("docs:connectInstantly")}
              fromColor="#d8b4fe"
              toColor="#9333ea"
            />
            <Feature
              icon={CameraIcon}
              text={t("docs:shareMoments")}
              fromColor="#f9a8d4"
              toColor="#db2777"
            />
            <Feature
              icon={MessageCircleIcon}
              text={t("docs:chatRealTime")}
              fromColor="#5eead4"
              toColor="#16a34a"
            />
          </div>
          <div className="mt-16 flex flex-wrap gap-4 items-center justify-center">
            <Button variant="link" onClick={() => openDocument("privacy")}>
              {t("docs:policies.privacy_policy.title")}
            </Button>
            <Button variant="link" onClick={() => openDocument("tos")}>
              {t("docs:policies.terms_of_service.title")}
            </Button>
          </div>
          <div className=" py-8 w-full flex items-center justify-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="flex-1 relative hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=1200&fit=crop&q=80"
          alt="People connecting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-purple-600/20"></div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
