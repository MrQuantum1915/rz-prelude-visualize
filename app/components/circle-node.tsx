import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { formatBits } from '../utils/tree-parser';
import { getHeatmapColor } from '../utils/colors';
import { CircleNodeData } from '../types/tree';

interface CircleNodeProps {
  data: CircleNodeData;
  selected?: boolean;
  [key: string]: unknown;
}

function CircleNodeComponent({
  data,
  selected,
}: CircleNodeProps) {
  const isRoot = data.byte_val === undefined;
  const isLR = data.orientation === 'LR';

  const targetPos = isLR ? Position.Left : Position.Top;
  const sourcePos = isLR ? Position.Right : Position.Bottom;

  // High-contrast, subtle borders, bright text
  let borderStyle = '';
  let customStyle: React.CSSProperties = {};

  if (data.isHeatmap && data.root_hit_cnt && data.root_hit_cnt > 0) {
    const ratio = data.hit_cnt / data.root_hit_cnt;
    const { bg, text } = getHeatmapColor(ratio, data.heatmapPalette || 'rocket');
    customStyle = { backgroundColor: bg, color: text, borderColor: text };
    borderStyle = 'shadow-md hover:border-orange-500';
  } else {
    if (isRoot) {
      borderStyle = 'border-cyan-300 dark:border-cyan-800 bg-cyan-50 dark:bg-[#001122] text-cyan-700 dark:text-cyan-400 font-bold hover:border-cyan-400 dark:hover:border-cyan-500 shadow-md';
    } else if (data.isSearchPath) {
      borderStyle = 'border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-[#221100] text-orange-700 dark:text-orange-400 font-bold hover:border-orange-400 dark:hover:border-orange-400 shadow-md';
    } else {
      borderStyle = 'border-zinc-300 dark:border-zinc-800 bg-white dark:bg-black text-zinc-900 dark:text-white hover:border-zinc-400 dark:hover:border-zinc-500 shadow-sm';
    }
  }

  if (selected) {
    borderStyle += ' ring-2 ring-orange-500/50 shadow-lg';
  }

  return (
    <div
      className={`relative flex items-center justify-center rounded-full border-2 w-16 h-16 transition-colors group hover:z-50 ${borderStyle}`}
      style={customStyle}
    >
      {/* Target Handle (Input) - not needed for root */}
      {!isRoot && (
        <Handle
          type="target"
          position={targetPos}
          className="!bg-zinc-400 dark:!bg-zinc-600 !w-2 !h-2"
        />
      )}

      {/* Hex value display - bright and clear */}
      <span className="font-mono text-base font-bold select-none tracking-tight">
        {data.label}
      </span>

      {/* Custom Tooltip - absolute to be on top, hover:z-50 on parent guarantees it's over other nodes */}
      <div className="absolute bottom-full mb-3 hidden group-hover:block bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-100 p-3 font-mono whitespace-nowrap shadow-xl rounded-none pointer-events-none">
        <div className="font-bold text-zinc-800 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800 pb-1.5 mb-1.5">
          {isRoot ? 'Root Node' : 'Byte Node'}
        </div>
        {data.byte_val !== undefined && (
          <>
            <div>Hex: <span className="text-zinc-900 dark:text-white font-bold">0x{data.byte_val.toString(16).padStart(2, '0').toUpperCase()}</span></div>
            <div>Bits: <span className="text-zinc-900 dark:text-white font-bold">{formatBits(data.byte_val)}</span></div>
          </>
        )}
        <div className="mt-1.5 pt-1.5 border-t border-zinc-200 dark:border-zinc-800">Hits: <span className="text-zinc-900 dark:text-white font-bold">{data.hit_cnt}</span></div>
      </div>

      {/* Source Handle (Output) */}
      <Handle
        type="source"
        position={sourcePos}
        className="!bg-zinc-400 dark:!bg-zinc-600 !w-2 !h-2"
      />
    </div>
  );
}

export default memo(CircleNodeComponent);

