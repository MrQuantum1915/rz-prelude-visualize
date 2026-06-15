import React from 'react';
import { Node } from '@xyflow/react';
import { formatBits, getNodePathString } from '../../utils/tree-parser';
import { LoadedFile, CircleNodeData } from '../../types/tree';

interface NodeInspectorProps {
  selectedNode: Node<CircleNodeData> | null;
  activeFile: LoadedFile | undefined;
}

export default function NodeInspector({ selectedNode, activeFile }: NodeInspectorProps) {
  if (!selectedNode || !activeFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-600 p-6 text-center font-mono text-sm leading-relaxed bg-white dark:bg-[#09090b]">
        <svg className="w-12 h-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>CLICK A NODE IN THE TREE TO INSPECT ITS PROPERTIES</div>
      </div>
    );
  }

  const isRoot = selectedNode.data.byte_val === undefined;
  const pathString = getNodePathString(selectedNode.id);

  // Compute percentage of parent node's hits
  let parentPercentage = null;
  if (!isRoot && selectedNode.data.parent_hit_cnt && selectedNode.data.parent_hit_cnt > 0) {
    parentPercentage = ((selectedNode.data.hit_cnt / selectedNode.data.parent_hit_cnt) * 100).toFixed(2);
  }

  return (
    <div className="flex flex-col h-full divide-y divide-zinc-200 dark:divide-zinc-800 overflow-y-auto bg-white dark:bg-[#09090b]">
      <div className="p-5">
        <div className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-wider uppercase mb-1">
          NODE TYPE
        </div>
        <div className={`text-2xl font-bold tracking-tight ${isRoot ? 'text-cyan-600 dark:text-cyan-400' : 'text-orange-600 dark:text-orange-500'}`}>
          {isRoot ? 'ROOT ENTRY' : 'BYTE NODE'}
        </div>
      </div>

      <div className="p-5">
        <div className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-wider uppercase mb-3">
          NODE DATA
        </div>
        {!isRoot && selectedNode.data.byte_val !== undefined && (
          <div className="space-y-4 mb-4">
            <div>
              <div className="text-xs text-zinc-500 mb-1">HEX VALUE</div>
              <div className="text-xl font-mono font-bold text-zinc-900 dark:text-white">
                0x{selectedNode.data.byte_val.toString(16).padStart(2, '0').toUpperCase()}
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 mb-1">BINARY BITS</div>
              <div className="text-base font-mono text-zinc-900 dark:text-white tracking-widest">
                {formatBits(selectedNode.data.byte_val)}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <div className="text-xs text-zinc-500 mb-1">TRAFFIC / HITS COUNT</div>
            <div className="text-xl font-mono font-bold text-zinc-900 dark:text-white">
              {selectedNode.data.hit_cnt.toLocaleString()}
            </div>
          </div>
          {!isRoot && parentPercentage !== null && (
            <div>
              <div className="text-xs text-zinc-500 mb-1">% OF PARENT TRAFFIC</div>
              <div className="text-base font-mono font-bold text-orange-600 dark:text-orange-400">
                {parentPercentage}%
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-wider uppercase mb-3">
          ABSOLUTE PATH FROM ROOT
        </div>
        <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 p-4 rounded-none font-mono text-sm text-zinc-800 dark:text-zinc-300 break-all leading-loose">
          {pathString}
        </div>
        <div className="text-xs text-zinc-500 mt-3 leading-relaxed">
          The exact sequence of bytes leading from the root prefix to this specific node.
        </div>
      </div>
    </div>
  );
}
