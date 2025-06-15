import { PlayerProps } from './PlayerProps';

interface PropsProps {
  onRefreshData?: () => void;
}

export const Props = ({ onRefreshData }: PropsProps) => {
  return (
    <div className="space-y-6">
      {/* Props Header */}
      {/* Player Props */}
      <PlayerProps onRefreshData={onRefreshData} />
    </div>
  );
};
