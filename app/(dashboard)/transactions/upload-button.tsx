/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Upload } from 'lucide-react'
import { useCSVReader } from 'react-papaparse'

import { Button } from '@/components/ui/button'

type Props = {
  onUpload: (results: any) => void;
}

export default function UploadButton({
  onUpload
}: Props) {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: any) => (
        <Button
          size='sm'
          className='w-full lg:w-auto'
          {...getRootProps()}>
          <Upload className='size-4 mr-2' />
          Importar
        </Button>
      )}
    </CSVReader>
  )
}
