import React from 'react';
import AboutModal from './modals/AboutModal'
import ConfigModal from './modals/ConfigModal'
import ContactModal from './modals/ContactModal'
import EditProfileModal from './modals/EditProfileModal'
import EventsModal from './modals/EventsModal'
import FaqsModal from './modals/FaqsModal'
import LevelsModal from './modals/LevelsModal'
import RankingModal from './modals/RankingModal'
import SecurityModal from './modals/SecurityModal'
import ShareModal from './modals/ShareModal'
import StartModal from './modals/StartModal'
import SupportModal from './modals/SupportModal'
import TutorialModal from './modals/TutorialModal'
import CompaniesModal from './modals/CompaniesModal'
import ConcessionaireModal from './modals/ConcessionaireModal'
import EmployeesModal from './modals/EmployeesModal'
import GaragesModal from './modals/GaragesModal'
import GasStationModal from './modals/GasStationModal'
import MaintenanceModal from './modals/MaintenanceModal'
import MapModal from './modals/MapModal'
import RealStateModal from './modals/RealStateModal'
import RoutesModal from './modals/RoutesModal'
import VehiclesModal from './modals/VehiclesModal'

function CentralWall({ activeModal, setActiveModal }) {
  return (
    <section id='wallContainer'>
        {activeModal === "start" && <StartModal/>}
        {activeModal === "about" && <AboutModal onClose={() => setActiveModal("start")} />}
        {activeModal === "ranking" && <RankingModal onClose={() => setActiveModal("start")} />}
        {activeModal === "tutorial" && <TutorialModal onClose={() => setActiveModal("start")} />}
        {activeModal === "share" && <ShareModal onClose={() => setActiveModal("start")} />}
        {activeModal === "events" && <EventsModal onClose={() => setActiveModal("start")} />}
        {activeModal === "faqs" && <FaqsModal onClose={() => setActiveModal("start")} />}
        {activeModal === "security" && <SecurityModal onClose={() => setActiveModal("start")} />}
        {activeModal === "contact" && <ContactModal onClose={() => setActiveModal("start")} />}
        {activeModal === "support" && <SupportModal onClose={() => setActiveModal("start")} />}
        {activeModal === "levels" && <LevelsModal onClose={() => setActiveModal("start")} />}
        {activeModal === "config" && <ConfigModal onClose={() => setActiveModal("start")} />}
        {activeModal === "edit-profile" && <EditProfileModal onClose={() => setActiveModal("start")} />}
        {activeModal === "companies" && <CompaniesModal onClose={() => setActiveModal("start")} />}
        {activeModal === "concessionaire" && <ConcessionaireModal onClose={() => setActiveModal("start")} />}
        {activeModal === "employees" && <EmployeesModal onClose={() => setActiveModal("start")} />}
        {activeModal === "garages" && <GaragesModal onClose={() => setActiveModal("start")} />}
        {activeModal === "gas-station" && <GasStationModal onClose={() => setActiveModal("start")} />}
        {activeModal === "maintenance" && <MaintenanceModal onClose={() => setActiveModal("start")} />}
        {activeModal === "map" && <MapModal onClose={() => setActiveModal("start")} />}
        {activeModal === "realState" && <RealStateModal onClose={() => setActiveModal("start")} />}
        {activeModal === "routes" && <RoutesModal onClose={() => setActiveModal("start")} />}
        {activeModal === "vehicles" && <VehiclesModal onClose={() => setActiveModal("start")} />}
    </section>
  );
}

export default CentralWall;