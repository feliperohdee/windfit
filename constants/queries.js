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
                length: $shortLength
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
    specialEvent: `query (
        $id: String
        $shortLength: Int
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