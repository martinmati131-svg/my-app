import React from 'react';
import { Explanation } from '../types';
import { CheckIcon, XMarkIcon } from './icons';

interface ExplanationCardProps {
    explanation: Explanation | null;
    isLoading: boolean;
    error: string | null;
}

const LoadingSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-700 rounded w-1/3"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
        <div className="space-y-2 pt-4">
             <div className="h-4 bg-gray-700 rounded w-3/4"></div>
             <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
    </div>
);

const ExplanationCard: React.FC<ExplanationCardProps> = ({ explanation, isLoading, error }) => {
    return (
        <div className="bg-gray-800/60 p-6 rounded-lg shadow-xl border border-gray-700 min-h-[200px]">
            {isLoading ? (
                <LoadingSkeleton />
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-full text-red-400">
                    <p className="font-semibold">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            ) : explanation ? (
                <div>
                    <h2 className="text-xl font-bold text-cyan-300 mb-2">{explanation.title}</h2>
                    <p className="text-gray-300 mb-4">{explanation.description}</p>
                    <ul className="space-y-2">
                        {explanation.pros_cons.map((item, index) => {
                            const isPro = item.startsWith('+');
                            return (
                                <li key={index} className="flex items-start">
                                    {isPro ? (
                                        <CheckIcon className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0 text-green-400" />
                                    ) : (
                                        <XMarkIcon className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0 text-red-400" />
                                    )}
                                    <span className={isPro ? 'text-green-300' : 'text-red-300'}>
                                        <span className="font-semibold">{isPro ? 'Pro: ' : 'Con: '}</span>
                                        {item.substring(2)}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : null}
        </div>
    );
};

export default ExplanationCard;