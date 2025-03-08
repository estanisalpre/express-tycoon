import React, { useState } from "react";
import LeftWall from "../components/LeftWall";
import RightWall from "../components/RightWall";
import CentralWall from '../components/CentralWall';
import PlayerMenu from "../components/PlayerMenu";
import PlayerTopStats from "../components/PlayerTopStats";

function Game() {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <section id="fatherContainer">
      <PlayerTopStats/>
      <LeftWall setActiveModal={setActiveModal}/>
      <CentralWall activeModal={activeModal} setActiveModal={setActiveModal}/>
      <RightWall/>
      <PlayerMenu/>
    </section>
  );
}

export default Game;