// app/forms/new/page.tsx
'use client';

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import FormBuilder from '@/comps/form/form-builder/form-builder';
import { FormSchema, FormField } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import FormPreview from '@/comps/form/form-builder/form-preview';
import { fromJSON } from 'postcss';

export default function TestFormPage() {
    const [formJson, setFormJson] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const [editingForm, setEditingForm] = useState<FormSchema | null>(null);

    const handleEdit = () => {
        setEditingForm(formJson);     // เซต JSON ที่จะใช้แก้ไข
        setIsOpen(true);              // เปิด modal
    };

    const handleSave = (json: any) => {
        console.log('Saved form JSON:', json);
        setFormJson(json);
        setIsOpen(false);
    };

    const defaultForm: FormSchema = {
        id: uuidv4(),
        title: '',
        description: '',
        fields: [],
        theme: {
            primaryColor: '#3b82f6',
            backgroundColor: '#ffffff',
            textColor: '#000000',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-black">Create New Form</h1>

            {!formJson && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Open Form Builder
                </button>
            )}

            {/* Modal */}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-[80%] rounded bg-white p-6 max-h-[80vh] overflow-y-auto">
                        <Dialog.Title className="text-xl font-semibold mb-4 text-black">Form Builder</Dialog.Title>

                        <div className="space-y-4">
                            <FormBuilder initialForm={editingForm || defaultForm} onSave={handleSave} />

                            <div className="text-right">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                    </Dialog.Panel>
                </div>
            </Dialog>

            {formJson && (
                <div className="mt-4">
                    <button
                        onClick={() => setIsPreviewOpen(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Show Preview
                    </button>
                </div>
            )}


            {formJson && (
                <div className="mt-6 p-4 bg-gray-100 rounded text-black">
                    <h2 className="text-xl font-semibold">Generated JSON:</h2>
                    <pre className="whitespace-pre-wrap">{JSON.stringify(formJson, null, 2)}</pre>
                </div>
            )}

            {formJson && (
                <div className="mt-2">
                    <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        Edit Form
                    </button>
                </div>
            )}


            {/* Modal Preview */}
            <Dialog open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
                    <Dialog.Panel className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded bg-white p-6">
                        <Dialog.Title className="text-xl font-semibold mb-4 text-black">Form Preview</Dialog.Title>
                        {formJson && <FormPreview form={formJson} />}
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                className="text-sm text-gray-600 hover:text-gray-800"
                            >
                                Close
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}
