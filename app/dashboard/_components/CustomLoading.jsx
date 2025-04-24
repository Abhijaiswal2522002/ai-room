import React from 'react';
import Image from 'next/image';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function CustomLoading({ loading }) {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Redesigning in Progress</AlertDialogTitle>
          <AlertDialogDescription>
            Please wait while AI redesigns your room. Do not refresh the page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className='bg-black flex flex-col items-center justify-center py-5'>
          <Image
            src={'/loadingai.gif'}
            alt='loading'
            width={100}
            height={100}
          />
          <h2 className='text-blue-50 mt-4'>Redesigning your Room ...</h2>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CustomLoading;
