import React from 'react';
import Iframe from 'react-iframe';

const MapComponent: React.FC = () => {
  return (
    <div>
      <Iframe
        url="image_location_map.html" 
        width="100%"
        height="500px"
        frameBorder={0}
      />
    </div>
  );
};

export default MapComponent;
