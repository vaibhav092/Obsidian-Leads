import React, { useState } from 'react';

const FilterField = ({ field, config, value, onChange, onRemove }) => {
    const [operator, setOperator] = useState(value?.operator || config.operators[0]);
    const [inputValue, setInputValue] = useState(value?.value || '');

    const handleOperatorChange = (newOperator) => {
        setOperator(newOperator);
        if (value) {
            onChange(field, newOperator, value.value);
        }
    };

    const handleValueChange = (newValue) => {
        setInputValue(newValue);
        onChange(field, operator, newValue);
    };

    const handleRemove = () => {
        setInputValue('');
        setOperator(config.operators[0]);
        onRemove();
    };

    const renderInput = () => {
        switch (config.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => handleValueChange(e.target.value)}
                        placeholder={`Enter ${config.label.toLowerCase()}`}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                    />
                );
            
            case 'select':
                if (operator === 'in') {
                    return (
                        <div className="space-y-2">
                            {config.options.map((option, index) => (
                                <label key={option} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={Array.isArray(inputValue) ? inputValue.includes(option) : false}
                                        onChange={(e) => {
                                            const currentValues = Array.isArray(inputValue) ? [...inputValue] : [];
                                            if (e.target.checked) {
                                                currentValues.push(option);
                                            } else {
                                                const index = currentValues.indexOf(option);
                                                if (index > -1) currentValues.splice(index, 1);
                                            }
                                            handleValueChange(currentValues);
                                        }}
                                        className="rounded-lg border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-2 w-5 h-5"
                                    />
                                    <span className="text-base text-gray-200 capitalize font-medium">{option}</span>
                                </label>
                            ))}
                        </div>
                    );
                } else {
                    return (
                        <select
                            value={inputValue}
                            onChange={(e) => handleValueChange(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                        >
                            <option value="">Select {config.label.toLowerCase()}</option>
                            {config.options.map(option => (
                                <option key={option} value={option} className="capitalize">
                                    {option}
                                </option>
                            ))}
                        </select>
                    );
                }
            
            case 'number':
                if (operator === 'between') {
                    return (
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={Array.isArray(inputValue) ? inputValue[0] || '' : ''}
                                onChange={(e) => {
                                    const newValue = Array.isArray(inputValue) ? [...inputValue] : ['', ''];
                                    newValue[0] = e.target.value;
                                    handleValueChange(newValue);
                                }}
                                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 text-white text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={Array.isArray(inputValue) ? inputValue[1] || '' : ''}
                                onChange={(e) => {
                                    const newValue = Array.isArray(inputValue) ? [...inputValue] : ['', ''];
                                    newValue[1] = e.target.value;
                                    handleValueChange(newValue);
                                }}
                                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 text-white text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                            />
                        </div>
                    );
                } else {
                    return (
                        <input
                            type="number"
                            value={inputValue}
                            onChange={(e) => handleValueChange(e.target.value)}
                            placeholder={`Enter ${config.label.toLowerCase()}`}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                        />
                    );
                }
            
            case 'date':
                if (operator === 'between') {
                    return (
                        <div className="flex space-x-2">
                            <input
                                type="date"
                                value={Array.isArray(inputValue) ? inputValue[0] || '' : ''}
                                onChange={(e) => {
                                    const newValue = Array.isArray(inputValue) ? [...inputValue] : ['', ''];
                                    newValue[0] = e.target.value;
                                    handleValueChange(newValue);
                                }}
                                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 text-white text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                            />
                            <input
                                type="date"
                                value={Array.isArray(inputValue) ? inputValue[1] || '' : ''}
                                onChange={(e) => {
                                    const newValue = Array.isArray(inputValue) ? [...inputValue] : ['', ''];
                                    newValue[1] = e.target.value;
                                    handleValueChange(newValue);
                                }}
                                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 text-white text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                            />
                        </div>
                    );
                } else {
                    return (
                        <input
                            type="date"
                            value={inputValue}
                            onChange={(e) => handleValueChange(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                        />
                    );
                }
            
            case 'boolean':
                return (
                    <select
                        value={inputValue}
                        onChange={(e) => handleValueChange(e.target.value === 'true')}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                    >
                        <option value="">Select {config.label.toLowerCase()}</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                );
            
            default:
                return null;
        }
    };

    return (
        <div className="p-5 bg-gray-800/60 rounded-2xl border border-gray-700/60 shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
                <label className="text-base font-semibold text-white">{config.label}</label>
                {value && (
                    <button
                        onClick={handleRemove}
                        className="text-red-400 hover:text-red-300 text-lg font-bold transition-colors duration-200"
                        title="Remove filter"
                    >
                        ✕
                    </button>
                )}
            </div>
            
            <select
                value={operator}
                onChange={(e) => handleOperatorChange(e.target.value)}
                className="w-full mb-4 px-4 py-3 bg-gray-700 border border-gray-600 text-white text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
            >
                {config.operators.map(op => (
                    <option key={op} value={op} className="capitalize">
                        {op === 'gt' ? 'Greater than' : 
                         op === 'lt' ? 'Less than' : 
                         op === 'gte' ? 'Greater than or equal' : 
                         op === 'lte' ? 'Less than or equal' : 
                         op === 'between' ? 'Between' : 
                         op === 'in' ? 'In' : 
                         op === 'on' ? 'On' : 
                         op === 'before' ? 'Before' : 
                         op === 'after' ? 'After' : 
                         op}
                    </option>
                ))}
            </select>
            
            {renderInput()}
        </div>
    );
};

export default FilterField;
