'use client';

import { FormSchema } from '@/lib/types';
import FormBuilder from '@/comps/form/form-builder/form-builder';
import { useRouter } from 'next/navigation';
import React, {useEffect, useState} from 'react'

import LayoutShell from "@/comps/layouts/LayoutShell";

function PageContent() {
  const router = useRouter();

  const handleSave = async (form: FormSchema) => {
    console.log("form", form)
  };

  return <FormBuilder onSave={handleSave} />;
}


export default function FormNew() {
  return (
      <>
          <LayoutShell>
              <PageContent></PageContent>
          </LayoutShell>
      </>
  );
}