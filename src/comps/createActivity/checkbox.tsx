import React from 'react';

// ทำให้ interface ชัดเจนและตรงตามการใช้งาน
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
              <label key={itemId} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(itemId)}
                  onChange={() => onItemChange(itemId)}
                />
                <span>{itemName}</span>
              </label>
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