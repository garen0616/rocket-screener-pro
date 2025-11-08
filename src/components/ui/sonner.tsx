"use client";

import { Toaster as SonnerToaster } from "sonner";

export type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

export const Toaster = ({ ...props }: ToasterProps) => (
  <SonnerToaster
    theme="dark"
    richColors
    closeButton
    position="top-right"
    toastOptions={{
      classNames: {
        toast:
          "bg-black/80 text-white border border-white/10 backdrop-blur rounded-2xl shadow-xl",
      },
    }}
    {...props}
  />
);
