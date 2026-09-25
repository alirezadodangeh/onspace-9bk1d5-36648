// Powered by OnSpace.AI
import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '@/constants/theme';
import { Entry } from '@/hooks/useEntries';

interface Props {
  entry: Entry;
  onDelete: (id: string) => void;
}

function formatAmount(amount: string): string {
  const num = parseInt(amount.replace(/,/g, ''), 10);
  if (isNaN(num)) return amount;
  return num.toLocaleString('fa-IR');
}

function EntryCard({ entry, onDelete }: Props) {
  const handleDelete = () => {
    Alert.alert('حذف', 'این آیتم حذف شود؟', [
      { text: 'انصراف', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => onDelete(entry.id) },
    ]);
  };

  const hasContent = entry.date || entry.amount || entry.sayyadId || entry.name || entry.nationalCode;

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          {entry.date ? (
            <View style={styles.dateBadge}>
              <MaterialIcons name="event" size={14} color={Colors.primary} />
              <Text style={styles.dateText}>{entry.date}</Text>
            </View>
          ) : (
            <View style={[styles.dateBadge, styles.dateBadgeEmpty]}>
              <MaterialIcons name="event" size={14} color={Colors.textMuted} />
              <Text style={[styles.dateText, { color: Colors.textMuted }]}>تاریخ نامشخص</Text>
            </View>
          )}
        </View>
        <Pressable
          style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.6 }]}
          onPress={handleDelete}
          hitSlop={8}
        >
          <MaterialIcons name="delete-outline" size={20} color={Colors.error} />
        </Pressable>
      </View>

      {!hasContent ? (
        <Text style={styles.noDataText}>اطلاعاتی استخراج نشد</Text>
      ) : (
        <View style={styles.fieldsGrid}>
          {entry.sayyadId ? (
            <View style={[styles.fieldChip, { backgroundColor: Colors.sayyadLight }]}>
              <MaterialIcons name="fingerprint" size={14} color={Colors.sayyad} />
              <View style={styles.fieldTexts}>
                <Text style={[styles.fieldLabel, { color: Colors.sayyad }]}>شناسه صیاد</Text>
                <Text style={[styles.fieldValue, { color: Colors.sayyad }]} numberOfLines={1}>
                  {entry.sayyadId}
                </Text>
              </View>
            </View>
          ) : null}

          {entry.amount ? (
            <View style={[styles.fieldChip, { backgroundColor: Colors.amountLight }]}>
              <MaterialIcons name="payments" size={14} color={Colors.amount} />
              <View style={styles.fieldTexts}>
                <Text style={[styles.fieldLabel, { color: Colors.amount }]}>مبلغ</Text>
                <Text style={[styles.fieldValue, { color: Colors.amount }]}>
                  {formatAmount(entry.amount)} ریال
                </Text>
              </View>
            </View>
          ) : null}

          {entry.name ? (
            <View style={[styles.fieldChip, { backgroundColor: Colors.accent }]}>
              <MaterialIcons name="person-outline" size={14} color={Colors.primary} />
              <View style={styles.fieldTexts}>
                <Text style={[styles.fieldLabel, { color: Colors.primary }]}>نام</Text>
                <Text style={[styles.fieldValue, { color: Colors.primaryDark }]}>
                  {entry.name}
                </Text>
              </View>
            </View>
          ) : null}

          {entry.nationalCode ? (
            <View style={[styles.fieldChip, { backgroundColor: Colors.nationalLight }]}>
              <MaterialIcons name="credit-card" size={14} color={Colors.national} />
              <View style={styles.fieldTexts}>
                <Text style={[styles.fieldLabel, { color: Colors.national }]}>کد ملی</Text>
                <Text style={[styles.fieldValue, { color: Colors.national }]}>
                  {entry.nationalCode}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      )}

      {/* Raw text preview */}
      <Text style={styles.rawPreview} numberOfLines={2}>
        {entry.rawText}
      </Text>
    </View>
  );
}

export default memo(EntryCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm + 2,
    ...Shadow.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dateBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dateBadgeEmpty: {
    backgroundColor: Colors.borderLight,
  },
  dateText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  deleteBtn: {
    padding: 4,
  },
  fieldsGrid: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  fieldChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 2,
    gap: Spacing.xs,
  },
  fieldTexts: {
    flex: 1,
    alignItems: 'flex-end',
  },
  fieldLabel: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    opacity: 0.75,
  },
  fieldValue: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginTop: 1,
  },
  noDataText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.sm,
    fontStyle: 'italic',
  },
  rawPreview: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'right',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.xs,
    lineHeight: 18,
  },
});
