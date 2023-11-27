import React, { useEffect, useState } from "react";
import LocationModal from "./CustomModal";
import SkillsModal from "./CustomModal";
import ExperienceLevelModal from "./CustomModal";
import JobModeModal from "./CustomModal";
import ProfileModal from "./CustomProfileModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CONSTANTS } from "../data/Constants";
import {
  faEnvelope,
  faLocationDot,
  faPenToSquare,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ProfilePage = (props) => {
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [skillsModalOpen, setSkillsModalOpen] = useState(false);
  const [ExpLevelModalOpen, setExpLevelModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [jobModeModalOpen, setJobModeModalOpen] = useState(false);

  const [alertShown, setAlertShown] = useState(false);

  const profile = props.profile;
  useEffect(() => {
    handleSkillsModalOpen();
    handleLocationModalOpen();
    handleExpLevelModalOpen();
  }, []);
  const handleSkillsModalOpen = () => {
    if (profile[CONSTANTS.PROFILE.SKILLS].length === 0) {
      setSkillsModalOpen(true);
    } 
  };

  const handleExpLevelModalOpen = () => {
    if (!profile[CONSTANTS.PROFILE.EXPERIENCE_LEVEL] || profile[CONSTANTS.PROFILE.EXPERIENCE_LEVEL].length === 0) {
      setExpLevelModalOpen(true);
    } 
  };

  const handleLocationModalOpen = () => {
    if (!profile[CONSTANTS.PROFILE.PREFERRED_LOCATIONS] || profile[CONSTANTS.PROFILE.PREFERRED_LOCATIONS].length === 0) {
      setLocationModalOpen(true);
    } 
  };

  // useEffect(() => {
  //   if (!profile[CONSTANTS.PROFILE.SKILLS] && alertShown) {
  //     alert("Skills field is required.");
  //   }
  //   if (!profile[CONSTANTS.PROFILE.EXPERIENCE_LEVEL] && alertShown) {
  //     alert("Experience Level field is required.");
  //   }
  //   if (!profile[CONSTANTS.PROFILE.PREFERRED_LOCATIONS] && alertShown) {
  //     alert("Locations field is required.");
  //   }
  // }, [profile, alertShown]);

  return (
    <div className="container" style={{ marginLeft: "8%", marginTop: "4%" }}>
      <div className="row gx-5">
        <div className="col-4 my-3">
          <div
            className="card p-4"
            style={{
              boxShadow: "0px 5px 12px 0px rgba(0,0,0,0.1)",
            }}
          >
            <FontAwesomeIcon
              icon={faPenToSquare}
              size="1x"
              onClick={() => setProfileModalOpen(true)}
              cursor="pointer"
              style={{ position: "absolute", top: "15", right: "15" }}
            />
            <div className="text-center my-3">
              <div
                className="text-center mt-3 d-inline-flex justify-content-center align-items-center"
                style={{
                  height: "200px",
                  width: "200px",
                  borderRadius: "100%",
                  backgroundColor: "#296E85",
                  color: "#fff",
                  boxShadow: "0px 5px 12px 10px rgba(0,0,0,0.1)",
                }}
              >
                <span style={{ fontSize: 60, letterSpacing: 1.2 }}>
                  {profile.fullName}
                </span>
              </div>
            </div>
            <div className="text-center mt-3">
              <h3 className="card-title mb-1">
                {profile[CONSTANTS.PROFILE.NAME]
                  ? profile[CONSTANTS.PROFILE.NAME]
                  : ""}
              </h3>
              <span style={{ fontSize: 20 }}>
                {profile[CONSTANTS.PROFILE.UNIVERSITY]
                  ? profile[CONSTANTS.PROFILE.UNIVERSITY]
                  : ""}
              </span>
            </div>
            <hr className="my-4" />
            <div className="row gy-4">
              <div className="col-12 d-flex align-items-center">
                <FontAwesomeIcon icon={faEnvelope} size="1x" />
                <span className="mx-2">
                  {profile[CONSTANTS.PROFILE.EMAIL]
                    ? profile[CONSTANTS.PROFILE.EMAIL]
                    : ""}
                </span>
              </div>
              <div className="col-12 d-flex align-items-center">
                <FontAwesomeIcon icon={faPhone} size="1x" />
                <span className="mx-2">
                  {profile[CONSTANTS.PROFILE.CONTACT]
                    ? profile[CONSTANTS.PROFILE.CONTACT]
                    : ""}
                </span>
              </div>
              <div className="col-12 d-flex align-items-center">
                <FontAwesomeIcon icon={faLocationDot} size="1x" />
                <span className="mx-2">
                  {profile[CONSTANTS.PROFILE.ADDRESS]
                    ? profile[CONSTANTS.PROFILE.ADDRESS]
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-8 px-0">
          <div
            className="card my-3 p-2"
            style={{
              boxShadow: "0px 5px 12px 0px rgba(0,0,0,0.1)",
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between px-0 mb-3">
                <h4 className="card-title mb-0 mx-1">Skills</h4>
                <div className="text-right">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    size="1x"
                    onClick={() => setSkillsModalOpen(true)}
                    cursor="pointer"
                    disabled={!profile[CONSTANTS.PROFILE.SKILLS]}
                  />
                </div>
              </div>
              <div className="d-flex flex-wrap">
                {profile[CONSTANTS.PROFILE.SKILLS]?.map((ele, index) => (
                  <span
                    className="badge rounded-pill m-1 py-2 px-3"
                    style={{
                      border: "2px solid",
                      backgroundColor: "#296e85",
                      fontSize: 16,
                      fontWeight: "normal",
                    }}
                    key={index}
                  >
                    {ele.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div
            className="card my-3 p-2"
            style={{
              boxShadow: "0px 5px 12px 0px rgba(0,0,0,0.1)",
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between px-0 mb-3">
                <h4 className="card-title mb-0 mx-1">Experience Level</h4>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  size="1x"
                  onClick={() => setExpLevelModalOpen(true)}
                  cursor="pointer"
                  disabled={!profile[CONSTANTS.PROFILE.EXPERIENCE_LEVEL]}
                />
              </div>
              <div className="d-flex flex-wrap">
                {profile[CONSTANTS.PROFILE.EXPERIENCE_LEVEL]?.map(
                  (ele, index) => (
                    <span
                      className="badge rounded-pill m-1 py-2 px-3"
                      style={{
                        border: "2px solid",
                        backgroundColor: "#296e85",
                        fontSize: 16,
                        fontWeight: "normal",
                      }}
                      key={index}
                    >
                      {ele.label}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
          <div
            className="card my-3 p-2"
            style={{
              boxShadow: "0px 5px 12px 0px rgba(0,0,0,0.1)",
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between px-0 mb-3">
                <h4 className="card-title mb-0 mx-1">Locations</h4>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  size="1x"
                  onClick={() => setLocationModalOpen(true)}
                  cursor="pointer"
                  disabled={!profile[CONSTANTS.PROFILE.PREFERRED_LOCATIONS]}
                />
              </div>
              <div className="d-flex flex-wrap">
                {profile[CONSTANTS.PROFILE.PREFERRED_LOCATIONS]?.map(
                  (ele, index) => (
                    <span
                      className="badge rounded-pill m-1 py-2 px-3"
                      style={{
                        border: "2px solid",
                        backgroundColor: "#296e85",
                        fontSize: 16,
                        fontWeight: "normal",
                      }}
                      key={index}
                    >
                      {ele.label}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {locationModalOpen && (
        <LocationModal
          name={CONSTANTS.PROFILE.PREFERRED_LOCATIONS}
          options={CONSTANTS.COUNTRIES}
          profile={props.profile}
          setModalOpen={setLocationModalOpen}
          updateProfile={props.updateProfile}
        />
      )}
      {skillsModalOpen && (
        <SkillsModal
          name={CONSTANTS.PROFILE.SKILLS}
          options={CONSTANTS.SKILLS}
          profile={props.profile}
          setModalOpen={setSkillsModalOpen}
          updateProfile={props.updateProfile}
        />
      )}
      {ExpLevelModalOpen && (
        <ExperienceLevelModal
          name={CONSTANTS.PROFILE.EXPERIENCE_LEVEL}
          options={CONSTANTS.EXPERIENCE_LEVEL}
          profile={props.profile}
          setModalOpen={setExpLevelModalOpen}
          updateProfile={props.updateProfile}
        />
      )}
      {jobModeModalOpen && (
        <JobModeModal
          name={CONSTANTS.PROFILE.JOB_MODE}
          options={CONSTANTS.JOB_MODES}
          profile={props.profile}
          setModalOpen={setJobModeModalOpen}
          updateProfile={props.updateProfile}
        />
      )}
      {profileModalOpen && (
        <ProfileModal
          profile={props.profile}
          setModalOpen={setProfileModalOpen}
          updateProfile={props.updateProfile}
        />
      )}
    </div>
  );
};

export default ProfilePage;
