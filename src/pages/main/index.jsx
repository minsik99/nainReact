import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import MainComponent from "../../components/main/MainComponent";

const mainComponent = observer(() => {
  return (
    <div className="map_div">
      <MainComponent />
    </div>
  );
});

export default mainComponent;
