import React, { useEffect, useRef } from "react";

interface UpdateRingProps {
  children: React.ReactNode;
  identity: string;
  formKey: string | undefined | null;
}

const UpdateRing: React.FC<UpdateRingProps> = ({
  children,
  identity,
  formKey,
}) => {
  const containKey = identity === formKey;
  const ref = useRef<HTMLDivElement>(null);

  const hasScrolled = useRef(false);

  useEffect(() => {
    if (containKey && ref.current && !hasScrolled.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      hasScrolled.current = true;
    }
  }, [containKey]);

  const style = containKey
    ? "p-2 border border-red-500 bg-red-50 rounded-md animate-blinkBgSlow"
    : "";

  return (
    <div ref={ref}>
      <div className={style}>{children}</div>
      {containKey && (
        <p className="text-red-500 font-semibold text-xs mt-1">Update disini</p>
      )}
    </div>
  );
};

export default UpdateRing;
