import { AlertIcon } from './Icons';

const FormAlert = ({ message }) =>
  message ? (
    <div role="alert" className="flex items-start gap-2 rounded-lg bg-mac-red/10 px-3 py-2 text-[12px] font-medium text-mac-red">
      <AlertIcon className="mt-px h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  ) : null;

export default FormAlert;
