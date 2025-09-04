import { StyleSheet } from 'react-native';
import colors from './themes';

const globalStyles = StyleSheet.create({
    accountHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accountInfo: {
        flex: 1,
    },
    accountItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.grayLight, // replaced from #F8F9FA (approx to grayLight)
    },
    accountItemBalance: {
        fontSize: 14,
        color: '#666666', // NOTE: no close match in theme (between gray and grayDark)
    },
    accountItemInfo: {
        flex: 1,
    },
    accountItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    accountItemName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.grayDark, // replaced from #30353D (approx to grayDark #30363D)
        marginBottom: 2,
    },
    accountItemSymbol: {
        fontSize: 24,
        marginRight: 12,
    },
    accountName: {
        fontSize: 16,
        color: '#666666',
        marginHorizontal: 8,
    },
    accountSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.grayLight, // replaced from #F8F9FA (approx to grayLight)
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.notCompletelyLightGray, // NOTE: no close match in theme
    },
    accountSelectorBalance: {
        fontSize: 14,
        color: colors.grayDark, // NOTE: no close match in theme
    },
    accountSelectorInfo: {
        flex: 1,
    },
    accountSelectorLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    accountSelectorModal: {
        backgroundColor: colors.white,
        borderRadius: 20,
        margin: 20,
        maxHeight: '70%',
        width: '90%',
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    accountSelectorName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.grayDark, // replaced from #30353D (approx to grayDark #30363D)
        marginBottom: 2,
    },
    accountSelectorSymbol: {
        fontSize: 24,
        marginRight: 12,
    },
    accountsList: {
        maxHeight: 300,
    },
    accountSymbol: {
        fontSize: 20,
    },
    activeToggleButton: {
        backgroundColor: colors.primary,
    },
    activeToggleText: {
        color: colors.white,
    },
    backButton: {
        padding: 5,
        width: 38,
    },
    cancelButton: {
        backgroundColor: colors.grayLight, // replaced from #ECECEC (nearest theme color)
    },
    cancelButtonText: {
        color: colors.grayDark, // replaced from #30353D (approx to grayDark #30363D)
        fontWeight: '600',
    },
    categoryIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.white,
    },
    categoryName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: colors.grayDark, // replaced from #30353D (approx to grayDark #30363D)
    },
    closeButton: {
        padding: 4,
    },
    confirmActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    confirmButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    confirmButtonText: {
        color: colors.white,
        fontWeight: '600',
        backgroundColor: colors.primary,
    },
    confirmModal: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        width: '85%',
        borderWidth: 1,
        borderColor: colors.notCompletelyLightGray, // NOTE: no close match in theme
    },
    confirmText: {
        fontSize: 14,
        color: colors.grayDark, // replaced from #30353D (approx to grayDark #30363D)
        marginTop: 8,
        marginBottom: 16,
    },
    container: {
        flex: 1,
        backgroundColor: colors.grayDark, // replaced from #30353D (approx to grayDark #30363D)
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    createButton: {
        backgroundColor: colors.primary,
        marginHorizontal: 20,
        marginBottom: 20,
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: 'center',
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
        marginRight: 8,
    },
    createCategoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: colors.grayLight, // replaced from #F8F9FA (approx to grayLight)
        gap: 8,
    },
    createCategoryText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },
    disabledButton: {
        backgroundColor: '#ADADAD', // NOTE: no close match in theme
    },
    disabledButtonText: {
        color: colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: colors.grayDark, // replaced from #30353D (approx to grayDark #30363D)
        borderBottomWidth: 1,
        borderBottomColor: colors.backgroundDark, // replaced from #101215 (approx to backgroundDark #121212)
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: colors.grayDark, // NOTE: no close match in theme
    },
    menuButton: {
        padding: 5,
        width: 38,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.notCompletelyLightGray, // NOTE: no close match in theme
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // NOTE: alpha color; no theme token
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.almostBlack,
    },
    placeholder: {
        width: 38,
    },
    section: {
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.grayDark, // replaced from #30353D (approx to grayDark #30363D)
        marginBottom: 12,
    },
    selectedAccountItem: {
        backgroundColor: colors.tertiary, // NOTE: no close match in theme (AliceBlue)
    },
    statusBarArea: {
        backgroundColor: colors.grayDark, // replaced from #30353D (approx to grayDark #30363D)
    },
    subtitle: {
        fontSize: 16,
        color: colors.grayDark, // NOTE: no close match in theme
    },
    symbolText: {
        fontSize: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.almostBlack,
        marginBottom: 10,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 20,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: colors.grayLight,
        borderRadius: 25,
        padding: 4,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.grayDark, // NOTE: no close match in theme
    },
    totalAmount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.almostBlack,
    },
    totalSection: {
        backgroundColor: colors.grayLight, // replaced from #F8F9FA (approx to grayLight)
        borderRadius: 16,
        padding: 24,
        marginVertical: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.notCompletelyLightGray, // NOTE: no close match in theme
    }
});

export default globalStyles;