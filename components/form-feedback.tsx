import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'

export default function FormFeedback({ message, type }: { message: string | undefined, type: 'error' | 'success' }) {

  if (!message) return null;

  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      {type === 'success' && (
       <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
       <FaCheckCircle className='h-4 w-4' />
       <p>
         {message}
       </p>
     </div>
      )}
      {type === 'error'&& (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
          <FaExclamationTriangle className='h-4 w-4' />
          <p>
            {message}
          </p>
        </div>
      )}
    </div>
  );
}
