import { useState } from 'react';
import { ParameterType, parameterTypes } from '@/canvas/_core/_/parameter';

import { Input } from '@/components/UI/Input';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';

import { createParameter, createStructureParameter } from '@/canvas/utils/parameters/createParameter';
import { getParameterIcon } from '@/canvas/utils/nodes/getParameterIcon';

import { Plus } from 'lucide-react';

export const CreateParameterForm = ({ depth = 2, parentStructureId }: { depth?: number; parentStructureId?: string }) => {
    const [parameterName, setParameterName] = useState<string>('');
    const [parameterType, setParameterType] = useState<ParameterType>('number');

    const foundParameterType = parameterTypes.find((parameter) => parameter.type === parameterType);
    if (!foundParameterType) return;

    const handleCreateParameter = () => {
        parentStructureId
            ? createStructureParameter(parameterName, parameterType, parentStructureId)
            : createParameter(parameterName, parameterType);

        setParameterName('');
    };

    return (
        <div className="flex gap-1 items-center">
            <Input
                value={parameterName}
                onChange={setParameterName}
                placeholder="Имя переменной"
                className={`bg-depth-${depth} border border-depth-${depth < 3 ? 3 : depth + 1}`}
                max={16}
            />

            <DropdownAbsolute title={foundParameterType.label} icon={getParameterIcon(parameterType)} depth={depth}>
                {parameterTypes.map((parameter) => {
                    const Icon = getParameterIcon(parameter.type);

                    return (
                        <button
                            key={parameter.type}
                            onClick={() => setParameterType(parameter.type)}
                            className={`px-3 py-2 w-full flex items-center gap-2 text-left bg-depth-${depth + 1} hover:bg-depth-${depth + 2} border border-depth-${depth < 3 ? 3 : depth + 1} rounded-md cursor-pointer`}
                        >
                            <Icon size={16} className="min-w-4" />

                            <p className="w-max">{parameter.label}</p>
                        </button>
                    );
                })}
            </DropdownAbsolute>

            <button
                onClick={handleCreateParameter}
                className={`
                        flex items-center justify-center max-w-8 w-full h-8 rounded-md cursor-pointer border 
                        border-depth-${depth < 3 ? 3 : depth + 1} ${parameterName.length === 0 ? `bg-depth-${depth} text-foreground/50` : `bg-depth-${depth} hover:bg-depth-${depth + 1} active:bg-depth-${depth + 2} text-foreground`} 
                    `}
                disabled={parameterName.length === 0}
            >
                <Plus size={16} />
            </button>
        </div>
    );
};
