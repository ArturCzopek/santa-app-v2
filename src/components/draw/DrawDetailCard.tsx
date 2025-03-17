import React from 'react';
import { useTheme } from '@mui/material';
import DrawCardBase from './DrawCardBase';
import { Draw } from '../../models/Draw';
import { detailCardStyles } from '../../styles/drawCardStyles';

interface DrawDetailCardProps {
  draw: Draw;
}

const DrawDetailCard: React.FC<DrawDetailCardProps> = ({ draw }) => {
  const theme = useTheme();

  return (
    <DrawCardBase
      title={draw.drawName}
      description={draw.description}
      status={draw.status}
      cardStyles={detailCardStyles(theme)}
    >
      {/* Additional draw details can be added here */}
    </DrawCardBase>
  );
};

export default DrawDetailCard;