import React from 'react';
import TaskBoardModal from './TaskBoardModal';
import MeetingSchedulerModal from './MeetingSchedulerModal';
import IdeaBoardModal from './IdeaBoardModal';
import SharedNotesModal from './SharedNotesModal';
import PollsModal from './PollsModal';

const WorkModals = ({
    taskBoardVisible,
    meetingVisible,
    ideaVisible,
    notesVisible,
    pollsVisible,
    onClose
}) => {
    return (
        <>
            <TaskBoardModal visible={taskBoardVisible} onClose={onClose} />
            <MeetingSchedulerModal visible={meetingVisible} onClose={onClose} />
            <IdeaBoardModal visible={ideaVisible} onClose={onClose} />
            <SharedNotesModal visible={notesVisible} onClose={onClose} />
            <PollsModal visible={pollsVisible} onClose={onClose} />
        </>
    );
};

export default WorkModals;
