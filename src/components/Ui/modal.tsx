import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { twMerge } from "tailwind-merge";

type ModalProps = {
  className?: string;
  classWrap?: string;
  classOverlay?: string;
  classButtonClose?: string;
  visible: boolean;
  onClose: () => void;
  initialFocus?: React.RefObject<HTMLElement>;
  children: React.ReactNode;
  video?: boolean;
};

const Modal = ({
  className,
  classWrap,
  classOverlay,
  classButtonClose,
  visible,
  onClose,
  initialFocus,
  children,
  video,
}: ModalProps) => {
  return (
    <Transition show={visible} as={Fragment}>
      <Dialog
        initialFocus={initialFocus}
        className={`fixed inset-0 z-50 flex overflow-auto scroll-smooth p-6 md:px-4 ${className}`}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={`fixed inset-0 ${
              video
                ? "bg-n-7/95"
                : "dark:bg-n-6/90 bg-[#fff]/40 backdrop-blur-sm"
            } ${classOverlay}`}
            aria-hidden="true"
          />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom={`opacity-0 ${!video && "scale-95"}`}
          enterTo={`opacity-100 ${!video && "scale-100"}`}
          leave="ease-in duration-200"
          leaveFrom={`opacity-100 ${!video && "scale-100"}`}
          leaveTo={`opacity-0 ${!video && "scale-95"}`}
        >
          <Dialog.Panel
            className={twMerge(
              `bg-n-1 dark:bg-n-7 relative z-10 m-auto w-full overflow-hidden rounded-3xl border border-primary ${
                video &&
                "bg-n-7 static aspect-video overflow-hidden rounded-[1.25rem] shadow-[0_2.5rem_8rem_rgba(0,0,0,0.5)]"
              } ${classWrap}`,
            )}
          >
            <button
              className={twMerge(
                `text-0 fill-n-7 hover:fill-primary-1 ${"bg-n-1 absolute right-6 top-6 h-10 w-10 rounded-full"} ${classButtonClose}`,
              )}
              onClick={onClose}
            >
              <svg className="inline-block h-6 w-6" viewBox="0 0 24 24">
                <path
                  fill="#CB0C9F"
                  d="M6.613 5.21l.094.083L12 10.585l5.293-5.292a1 1 0 0 1 1.497 1.32l-.083.094L13.414 12l5.293 5.293a1 1 0 0 1-1.32 1.497l-.094-.083L12 13.414l-5.293 5.293a1 1 0 0 1-1.497-1.32l.083-.094L10.585 12 5.293 6.707A1 1 0 0 1 6.511 5.14l.101.069z"
                ></path>
              </svg>
            </button>
            {children}
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default Modal;
