import React from 'react';
import { IconCheck } from '@tabler/icons-react';

interface CheckboxGroupProps<T> {
  items: T[];
  selectedItems: (string | number)[];
  onItemChange: (id: string | number) => void;
  idKey: keyof T;
  nameKey: keyof T;
  label: string;
  isLoading?: boolean;
  required?: boolean;
}

const CheckboxGroup = <T extends Record<string, any>>({
  items,
  selectedItems,
  onItemChange,
  idKey,
  nameKey,
  label,
  isLoading = false,
  required = false,
}: CheckboxGroupProps<T>) => {
  const isItemSelected = (itemId: string | number) => selectedItems.includes(itemId);

  return (
    <div className="col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {isLoading ? (
        <span className="text-sm text-gray-500">กำลังโหลดข้อมูล...</span>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {items.map((item) => {
            const itemId = item[idKey];
            const itemName = item[nameKey] as string;

            return (
              <div
                key={itemId}
                onClick={() => onItemChange(itemId)}
                className={`
                  flex items-center justify-between gap-2 px-3 py-1 rounded-lg cursor-pointer border transition-all 
                  ${isItemSelected(itemId)
                    ? 'border-orange-600 text-orange-600 bg-white'
                    : 'border-gray-400 text-gray-500 bg-gray-100 hover:border-gray-500 hover:text-gray-700'}
                `}
              >
                <span className="mx-0 my-0 text-sm">{itemName}</span>
                <div className="w-3">
                  {isItemSelected(itemId) && <IconCheck size={20} />}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <span className="text-sm text-gray-500">ไม่พบข้อมูล</span>
      )}
    </div>
  );
};

export default CheckboxGroup;
