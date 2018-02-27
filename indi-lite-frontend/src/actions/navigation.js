export const Navigation = {

    toSection: section => {
        return {
            type: 'NAVIGATE_TO_SECTION',
            section
        }
    },

    toSession: (page, session) => {
        return {
            type: 'NAVIGATE_TO_SESSION',
            sessionPage: page,
            sessionId: session
        }
    }

}

export default Navigation

