module.exports = Object.freeze({
    INTERNAL_SERVER_ERROR_RESPONSE: 'Something went wrong on server, please try again later...',
    COLLECTION_NOT_FOUND_RESPONSE: 'Collection with provided id not found: $collectionId',
    USER_ALREADY_EXIST_RESPONSE: 'User with such email already exists',
    USER_DOES_NOT_EXIST_RESPONSE: 'User with provided id does not exist: :id',
    ONLY_ADMIN_OPERATION_RESPONSE: 'Only admin has permission for this operation',
    NOT_ENOUGH_PERMISSION_RESPONSE: 'Not enough permission for this operation',
    ITEM_NOT_FOUND_RESPONSE: 'Item with provided id not found: $itemId',
    COMMENT_NOT_FOUND_RESPONSE: 'Comment with provided id not found: $commentId'
});