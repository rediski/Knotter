import { useState, useEffect } from 'react';
import { ParameterType, parameterTypes } from '@/canvas/_core/_/parameter';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { Input } from '@/components/UI/Input';
import { DropdownAbsolute } from '@/components/UI/DropdownAbsolute';

import { createParameter, createParameterInStructure } from '@/canvas/utils/parameters/createParameter';
import { getParameterIcon } from '@/canvas/utils/nodes/getParameterIcon';

import { Plus, FolderTree, Globe } from 'lucide-react';

export const CreateParameterForm = () => {
    const [parameterName, setParameterName] = useState<string>('');
    const [parameterType, setParameterType] = useState<ParameterType>('number');
    const [selectedStructureId, setSelectedStructureId] = useState<string | null>(null);

    const parameters = useItemsStore((state) => state.parameters);
    const structures = parameters.filter((parameter) => parameter.type === 'structure');

    useEffect(() => {
        if (selectedStructureId && !structures.some((structure) => structure.id === selectedStructureId)) {
            setSelectedStructureId(null);
        }
    }, [structures, selectedStructureId]);

    const foundParameterType = parameterTypes.find((parameter) => parameter.type === parameterType);

    if (!foundParameterType) return;

    const handleCreateParameter = () => {
        const isStructure = selectedStructureId && structures.some((structure) => structure.id === selectedStructureId);

        if (isStructure) createParameterInStructure(parameterName, parameterType, selectedStructureId);
        if (!isStructure) createParameter(parameterName, parameterType);

        setParameterName('');
        setSelectedStructureId(null);
    };

    const getStructureName = (id: string) => {
        const structure = structures.find((structure) => structure.id === id);
        return structure?.name || 'Структура';
    };

    return (
        <div className="flex gap-1 items-center">
            <DropdownAbsolute title={foundParameterType.label} icon={getParameterIcon(parameterType)} depth={2} align="left">
                {parameterTypes.map((parameter) => {
                    const Icon = getParameterIcon(parameter.type);
                    const isSelected = parameter.type === parameterType;

                    return (
                        <button
                            key={parameter.type}
                            onClick={() => setParameterType(parameter.type)}
                            className={`
                                px-3 py-2 w-full flex items-center gap-2 text-left border rounded-md cursor-pointer
                                ${isSelected ? 'bg-bg-accent/10 border-bg-accent/10 text-text-accent' : 'bg-depth-3 hover:bg-depth-4 border-depth-4'}
                            `}
                        >
                            <Icon size={16} className="min-w-4" />
                            <p className="w-max">{parameter.label}</p>
                        </button>
                    );
                })}
            </DropdownAbsolute>

            <Input
                value={parameterName}
                onChange={setParameterName}
                placeholder="Имя переменной"
                max={16}
                className="border border-depth-3 bg-depth-2"
            />

            <DropdownAbsolute
                title={selectedStructureId ? getStructureName(selectedStructureId) : 'Глобально'}
                icon={selectedStructureId ? FolderTree : Globe}
                depth={2}
                align="left"
            >
                <button
                    onClick={() => setSelectedStructureId(null)}
                    className={`
                        px-3 py-2 w-full flex items-center gap-2 text-left border rounded-md cursor-pointer
                        ${!selectedStructureId ? 'bg-bg-accent/10 border-bg-accent/10 text-text-accent' : 'bg-depth-3 hover:bg-depth-4 border-depth-4'}
                    `}
                >
                    <Globe size={16} className="min-w-4" />

                    <p className="w-max">Глобально</p>
                </button>

                {structures.map((structure) => (
                    <button
                        key={structure.id}
                        onClick={() => setSelectedStructureId(structure.id)}
                        className={`
                            px-3 py-2 w-full flex items-center gap-2 text-left border rounded-md cursor-pointer
                            ${selectedStructureId === structure.id ? 'bg-bg-accent/10 border-bg-accent/10 text-text-accent' : 'bg-depth-3 hover:bg-depth-4 border-depth-4'}
                        `}
                    >
                        <FolderTree size={16} className="min-w-4" />

                        <p className="w-max">{structure.name}</p>
                    </button>
                ))}
            </DropdownAbsolute>

            <button
                onClick={handleCreateParameter}
                className={`
                    flex items-center justify-center max-w-16 w-full h-8 rounded-md cursor-pointer border border-depth-3
                    ${parameterName.length === 0 ? `bg-depth-2 text-foreground/50` : `bg-depth-2 hover:bg-depth-3 active:bg-depth-4 text-foreground`} 
                `}
                disabled={parameterName.length === 0}
            >
                <Plus size={16} />
            </button>
        </div>
    );
};
