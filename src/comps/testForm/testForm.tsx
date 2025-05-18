
'use client';

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import FormBuilder from '@/comps/form/form-builder/form-builder';
import { FormSchema, FormField } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import FormPreview from '@/comps/form/form-builder/form-preview';
import { fromJSON } from 'postcss';

// export default function TestFormPage() {
//     const [formJson, setFormJson] = useState<FormSchema | null>(null);
//     const [isOpen, setIsOpen] = useState(false);
interface TestFormProps {
  formJson: FormSchema | null;
  setFormJson: (json: FormSchema) => void;
}

export default function Testform({ formJson, setFormJson }: TestFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    

    // const [editingForm, setEditingForm] = useState<FormSchema | null>(null);

    // const handleEdit = () => {
    //     setEditingForm(formJson);     // เซต JSON ที่จะใช้แก้ไข
    //     setIsOpen(true);              // เปิด modal
    // };

    const handleSave = (json: any) => {
        if (!json || !json.id || !json.fields) {
            console.error('Invalid form JSON:', json);
            alert('ฟอร์มไม่สมบูรณ์ กรุณาตรวจสอบ');
            return;
        }
        console.log('Saved form JSON in Testform:', json);
        setFormJson(json); 
        setIsOpen(false);
        alert('บันทึกฟอร์มสำเร็จ');
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
    const formToEdit = formJson || defaultForm;

    return (
        <div className="p-6">
            <h2 className="text-4sm font-medium mb-4">สร้างฟอร์มสำหรับกิจกรรม</h2>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    {formJson ? 'Edit Form' : 'Create Form '}
                </button>

                {formJson && (
                    <div className="mb-6 mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-semibold">แบบฟอร์มของกิจกรรม:</h2>
                        <div className="text-sm text-gray-500">
                            แก้ไขล่าสุด: {new Date(formJson.updatedAt).toLocaleString('th-TH')}
                        </div>
                        </div>
                        <FormPreview form={formJson} />
                    </div>
                )}
            

            {/* Modal */}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-[80%] rounded bg-white p-6 max-h-[80vh] overflow-y-auto">
                        <Dialog.Title className="text-xl font-semibold mb-4 text-black">{formJson ? 'Edit Form' : 'Create Form'}</Dialog.Title>

                        <div className="space-y-4">
                            <FormBuilder initialForm={formToEdit} onSave={handleSave} />

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

            {/* {formJson && (
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
            )} */}


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
