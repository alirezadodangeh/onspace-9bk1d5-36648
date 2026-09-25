// Powered by OnSpace.AI
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '@/constants/theme';
import type { Entry } from '@/hooks/useEntries';

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface Props {
  visible: boolean;
  entry: Entry | null;
  onClose: () => void;
  onSave: (id: string, changes: Partial<Entry>) => void;
}

interface FieldConfig {
  key: keyof Omit<Entry, 'id' | 'createdAt' | 'rawText'>;
  label: string;
  icon: IconName;
  color: string;
  bg: string;
  placeholder: string;
  keyboardType?: 'default' | 'numeric';
}

const FIELDS: FieldConfig[] = [
  {
    key: 'date',
    label: 'تاریخ شمسی',
    icon: 'event',
    color: Colors.primary,
    bg: Colors.accent,
    placeholder: '1405/06/10',
  },
  {
    key: 'amount',
    label: 'مبلغ',
    icon: 'payments',
    color: Colors.amount,
    bg: Colors.amountLight,
    placeholder: '5000000',
    keyboardType: 'numeric',
  },
  {
    key: 'sayyadId',
    label: 'شناسه صیاد (۱۶ رقم)',
    icon: 'fingerprint',
    color: Colors.sayyad,
    bg: Colors.sayyadLight,
    placeholder: '1234567890123456',
    keyboardType: 'numeric',
  },
  {
    key: 'checkSerial',
    label: 'سریال چک',
    icon: 'receipt-long',
    color: Colors.check,
    bg: Colors.checkLight,
    placeholder: '156/054770',
  },
  {
    key: 'name',
    label: 'نام',
    icon: 'person-outline',
    color: Colors.primary,
    bg: Colors.accent,
    placeholder: 'علی رضایی',
  },
  {
    key: 'nationalCode',
    label: 'کد ملی (۱۰ رقم)',
    icon: 'credit-card',
    color: Colors.national,
    bg: Colors.nationalLight,
    placeholder: '0012345678',
    keyboardType: 'numeric',
  },
];

export default function EditEntryModal({ visible, entry, onClose, onSave }: Props) {
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (entry) {
      const initial: Record<string, string> = {};
      FIELDS.forEach((f) => {
        initial[f.key] = (entry[f.key] as string | null) ?? '';
      });
      setForm(initial);
    }
  }, [entry]);

  const handleSave = () => {
    if (!entry) return;
    const changes: Partial<Entry> = {};
    FIELDS.forEach((f) => {
      const val = form[f.key]?.trim() || null;
      (changes as Record<string, string | null>)[f.key] = val;
    });
    onSave(entry.id, changes);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>ویرایش آیتم</Text>
            <Pressable onPress={onClose} hitSlop={8} style={({ pressed }) => (pressed ? { opacity: 0.6 } : {})}>
              <MaterialIcons name="close" size={24} color={Colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {FIELDS.map((field) => (
              <View key={field.key} style={styles.fieldWrap}>
                <View style={styles.fieldLabelRow}>
                  <MaterialIcons name={field.icon} size={15} color={field.color} />
                  <Text style={[styles.fieldLabel, { color: field.color }]}>{field.label}</Text>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    { borderColor: form[field.key] ? field.color + '55' : Colors.border },
                    form[field.key] ? { backgroundColor: field.bg } : {},
                  ]}
                  value={form[field.key] ?? ''}
                  onChangeText={(v) => setForm((prev) => ({ ...prev, [field.key]: v }))}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.textMuted}
                  textAlign="right"
                  keyboardType={field.keyboardType ?? 'default'}
                  returnKeyType="next"
                />
              </View>
            ))}

            <Pressable
              style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.85 }]}
              onPress={handleSave}
            >
              <MaterialIcons name="check" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>ذخیره تغییرات</Text>
            </Pressable>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    ...Shadow.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.sm + 2,
  },
  fieldWrap: {
    gap: Spacing.xs,
  },
  fieldLabelRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
  },
  fieldLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  saveBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    marginTop: Spacing.sm,
    ...Shadow.sm,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
