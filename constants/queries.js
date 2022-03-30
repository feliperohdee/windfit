const fragments = {
    event: `fragment event on Event {
        description
        id
        name
        partners @include(if: $withPartners) {
            id
            name
        }
    }`,
    specialEvent: `fragment specialEvent on SpecialEvent {
        description {
            html
            raw
            short (
                length: $shortDescriptionLength
            )
        }
        id
        name
        partners @include(if: $withPartners) {
            id
            name
        }
    }`
};

module.exports = {
    event: `query (
        $id: String
        $withPartners: Boolean = true
    ) {
        event (
            id: $id
        ) {
            ...event
        }
    }
    
    ${fragments.event}`,
    // 
    events: `query (
        $limit: Int
        $orderBy: Json
        $withPartners: Boolean = true
    ) {
        events (
            limit: $limit
            orderBy: $orderBy
        ) {
            count
            data {
                ...event
            }
        }
    }
    
    ${fragments.event}`,
    // 
    isomorphicEvents: `query (
        $limit: Int
        $orderBy: EventsOrderBy
        $shortDescriptionLength: Int
        $withPartners: Boolean = true
    ) {
        isomorphicEvents (
            limit: $limit
            orderBy: $orderBy
        ) {
            count
            data {
                ...on Event {
                    ...event
                }
                ...on SpecialEvent {
                    ...specialEvent
                }
            }
        }
    }
    
    ${fragments.event}
    ${fragments.specialEvent}`,
    // 
    specialEvent: `query (
        $id: String
        $shortDescriptionLength: Int
        $withPartners: Boolean = true
    ) {
        specialEvent (
            id: $id
        ) {
            ...specialEvent
        }
    }
    
    ${fragments.specialEvent}`
};