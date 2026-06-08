import Link from "next/link";
import FormButton from "@/app/components/inputFormPemodalPerusahaan/component/FormButton";
import { Url } from "next/dist/shared/lib/router/router";

export const PanelContent: React.FC<{
  title: string;
  message?: string;
  renderMessage?: () => React.ReactNode;
  icon?: React.ReactNode;
  buttonTitle?: string;
  actionButton?: () => void;
  navigateToPath?: Url;
}> = ({
  title,
  message,
  icon,
  buttonTitle,
  renderMessage,
  actionButton,
  navigateToPath,
}) => {
  const renderContent = () => {
    if (renderMessage) {
      return renderMessage();
    }
    if (message) {
      return (
        <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
          {message}
        </p>
      );
    }
    return <p className="text-gray-400 text-sm md:text-base mb-4">-</p>;
  };

  const renderButton = () => {
    if (navigateToPath && buttonTitle) {
      return (
        <Link href={navigateToPath}>
          <FormButton>{buttonTitle}</FormButton>
        </Link>
      );
    }

    if (buttonTitle && actionButton) {
      return <FormButton onClick={actionButton}>{buttonTitle}</FormButton>;
    }

    return null;
  };

  return (
    <div className="flex flex-col items-center max-w-md">
      {icon && <div className="text-teal-700 mb-4">{icon}</div>}
      <h2 className="font-bold text-xl md:text-2xl text-black mb-2">{title}</h2>

      {renderContent()}

      {renderButton()}
    </div>
  );
};
