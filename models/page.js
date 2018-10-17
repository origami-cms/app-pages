module.exports = {
    name: 'page',
    properties: {
        id: 'uuid',
        title: {type: 'string', required: true},
        type: {type: 'string', required: false},
        url: {type: 'string', required: true},
        data: {type: 'object'}
    },
    tree: true
};
