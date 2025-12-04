// Centralized error messages for the application

export const ERROR_MESSAGES = {
    // Authentication errors
    AUTH_INVALID_CREDENTIALS: 'Email ou mot de passe incorrect',
    AUTH_EMAIL_IN_USE: 'Cette adresse email est déjà utilisée',
    AUTH_WEAK_PASSWORD: 'Le mot de passe doit contenir au moins 6 caractères',
    AUTH_USER_NOT_FOUND: 'Aucun compte associé à cet email',
    AUTH_TOO_MANY_REQUESTS: 'Trop de tentatives. Veuillez réessayer plus tard',
    AUTH_NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet',
    AUTH_POPUP_CLOSED: 'La fenêtre d\'authentification a été fermée',

    // Firestore/Database errors
    FIRESTORE_PERMISSION_DENIED: 'Vous n\'avez pas les permissions nécessaires pour cette action',
    FIRESTORE_NOT_FOUND: 'L\'élément demandé n\'a pas été trouvé',
    FIRESTORE_ALREADY_EXISTS: 'Cet élément existe déjà',
    FIRESTORE_NETWORK_ERROR: 'Erreur de connexion au serveur',
    FIRESTORE_UNAVAILABLE: 'Le service est temporairement indisponible',

    // Stock management
    STOCK_CREATE_ERROR: 'Impossible de créer le stock',
    STOCK_CREATE_SUCCESS: 'Stock créé avec succès',
    STOCK_UPDATE_ERROR: 'Impossible de mettre à jour le stock',
    STOCK_UPDATE_SUCCESS: 'Stock mis à jour avec succès',
    STOCK_DELETE_ERROR: 'Impossible de supprimer le stock',
    STOCK_DELETE_SUCCESS: 'Stock supprimé avec succès',
    STOCK_INVALID_RANGE: 'La plage de numéros est invalide',

    // User management
    USER_CREATE_SUCCESS: 'Utilisateur créé avec succès',
    USER_UPDATE_ERROR: 'Impossible de modifier l\'utilisateur',
    USER_UPDATE_SUCCESS: 'Utilisateur modifié avec succès',
    USER_DELETE_ERROR: 'Impossible de supprimer l\'utilisateur',
    USER_DELETE_SUCCESS: 'Utilisateur supprimé avec succès',
    USER_NOT_CONNECTED: 'Vous devez être connecté pour effectuer cette action',
    USER_LOCK_SUCCESS: 'Utilisateur verrouillé avec succès',
    USER_UNLOCK_SUCCESS: 'Utilisateur déverrouillé avec succès',

    // Role management
    ROLE_UPDATE_ERROR: 'Impossible de modifier le rôle',
    ROLE_UPDATE_SUCCESS: 'Rôle mis à jour avec succès',

    // Event management
    EVENT_CREATE_ERROR: 'Impossible de créer l\'événement',
    EVENT_CREATE_SUCCESS: 'Événement créé avec succès',
    EVENT_UPDATE_ERROR: 'Impossible de modifier l\'événement',
    EVENT_UPDATE_SUCCESS: 'Événement modifié avec succès',
    EVENT_DELETE_ERROR: 'Impossible de supprimer l\'événement',
    EVENT_DELETE_SUCCESS: 'Événement supprimé avec succès',

    // Product management  
    PRODUCT_CREATE_ERROR: 'Impossible de créer le produit',
    PRODUCT_CREATE_SUCCESS: 'Produit créé avec succès',
    PRODUCT_UPDATE_ERROR: 'Impossible de modifier le produit',
    PRODUCT_UPDATE_SUCCESS: 'Produit modifié avec succès',
    PRODUCT_DELETE_ERROR: 'Impossible de supprimer le produit',
    PRODUCT_DELETE_SUCCESS: 'Produit supprimé avec succès',

    // Access/Permissions
    ACCESS_UPDATE_ERROR: 'Impossible de modifier les permissions',
    ACCESS_UPDATE_SUCCESS: 'Permissions mises à jour avec succès',
    ACCESS_DENIED: 'Accès refusé',

    // Form validation
    FORM_REQUIRED_FIELDS: 'Veuillez remplir tous les champs obligatoires',
    FORM_INVALID_EMAIL: 'L\'adresse email est invalide',
    FORM_PASSWORD_MISMATCH: 'Les mots de passe ne correspondent pas',
    FORM_INVALID_PHONE: 'Le numéro de téléphone est invalide',

    // Generic messages
    SUCCESS: 'Opération effectuée avec succès',
    ERROR: 'Une erreur est survenue',
    UNKNOWN_ERROR: 'Une erreur inattendue s\'est produite',
    LOADING_ERROR: 'Erreur lors du chargement des données',
    SAVE_ERROR: 'Erreur lors de l\'enregistrement',
    DELETE_CONFIRM: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
}

// Helper function to get Firebase error message
export const getFirebaseErrorMessage = (errorCode: string): string => {
    const errorMap: Record<string, string> = {
        'auth/invalid-credential': ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS,
        'auth/user-not-found': ERROR_MESSAGES.AUTH_USER_NOT_FOUND,
        'auth/wrong-password': ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS,
        'auth/email-already-in-use': ERROR_MESSAGES.AUTH_EMAIL_IN_USE,
        'auth/weak-password': ERROR_MESSAGES.AUTH_WEAK_PASSWORD,
        'auth/too-many-requests': ERROR_MESSAGES.AUTH_TOO_MANY_REQUESTS,
        'auth/network-request-failed': ERROR_MESSAGES.AUTH_NETWORK_ERROR,
        'permission-denied': ERROR_MESSAGES.FIRESTORE_PERMISSION_DENIED,
        'not-found': ERROR_MESSAGES.FIRESTORE_NOT_FOUND,
        'already-exists': ERROR_MESSAGES.FIRESTORE_ALREADY_EXISTS,
        'unavailable': ERROR_MESSAGES.FIRESTORE_UNAVAILABLE,
    }

    return errorMap[errorCode] || ERROR_MESSAGES.UNKNOWN_ERROR
}
