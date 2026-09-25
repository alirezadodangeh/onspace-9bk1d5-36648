// Powered by OnSpace.AI
import React, { useState, useRef } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '@/constants/theme';
import { extractData, ExtractedData } from '@/services/extractionService';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: ExtractedData) => void;
}

interface PreviewField {
  label: string;
  value: string | null;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  bg: string;
}

export default function AddEntryModal({ visible, onClose, onSave }: Props) {
  const [text, setText] = useState('');
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleExtract = () => {
    if (!text.trim()) return;
    setProcessing(true);
    setTimeout(() => {
      const result = extractData(text.trim());
      setExtracted(result);
      setProcessing(false);
    }, 300);
  };

  const handleSave = () => {
    if (!extracted) return;
    onSave(extracted);
    handleClose();
  };

  const handleClose = () => {
    setText('');
    setExtracted(null);
    setProcessing(false);
    onClose();
  };

  const fields: PreviewField[] = extracted
    ? [
        {
          label: 'تاریخ شمسی',
          value: extracted.date,
          icon: 'event',
          color: Colors.primary,
          bg: Colors.accent,
        },
        {
          label: 'مبلغ',
          value: extracted.amount
            ? parseInt(extracted.amount.replace(/,/g, ''), 10).toLocaleString('fa-IR') + ' ریال'
            : null,
          icon: 'payments',
          color: Colors.amount,
          bg: Colors.amountLight,
        },
        {
          label: 'شناسه صیاد (۱۶ رقم)',
          value: extracted.sayyadId,
          icon: 'fingerprint',
          color: Colors.sayyad,
          bg: Colors.sayyadLight,
        },
        {
          label: 'نام',
          value: extracted.name,
          icon: 'person-outline',
          color: Colors.primary,
          bg: Colors.accent,
        },
        {
          label: 'کد ملی (۱۰ رقم)',
          value: extracted.nationalCode,
          icon: 'credit-card',
          color: Colors.national,
          bg: Colors.nationalLight,
        },
      ]
    : [];

  const foundCount = extracted
    ? [extracted.date, extracted.amount, extracted.sayyadId, extracted.name, extracted.nationalCode].filter(Boolean).length
    : 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>افزودن آیتم جدید</Text>
            <Pressable onPress={handleClose} hitSlop={8} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
              <MaterialIcons name="close" size={24} color={Colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Text Input Area */}
            <Text style={styles.inputLabel}>متن را وارد کنید</Text>
            <TextInput
              ref={inputRef}
              style={styles.textArea}
              value={text}
              onChangeText={(t) => {
                setText(t);
                if (extracted) setExtracted(null);
              }}
              placeholder="متن شامل تاریخ، مبلغ، شناسه صیاد و... را اینجا بنویسید یا بچسبانید"
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={6}
              textAlign="right"
              textAlignVertical="top"
              returnKeyType="default"
            />

            {/* Extract Button */}
            <Pressable
              style={({ pressed }) => [
                styles.extractBtn,
                (!text.trim() || processing) && styles.extractBtnDisabled,
                pressed && { opacity: 0.85 },
              ]}
              onPress={handleExtract}
              disabled={!text.trim() || processing}
            >
              {processing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <MaterialIcons name="auto-awesome" size={18} color="#fff" />
              )}
              <Text style={styles.extractBtnText}>
                {processing ? 'در حال استخراج...' : 'استخراج اطلاعات'}
              </Text>
            </Pressable>

            {/* Extracted Preview */}
            {extracted ? (
              <View style={styles.preview}>
                <View style={styles.previewHeader}>
                  <View style={[
                    styles.foundBadge,
                    { backgroundColor: foundCount > 0 ? Colors.successLight : Colors.errorLight }
                  ]}>
                    <MaterialIcons
                      name={foundCount > 0 ? 'check-circle' : 'info'}
                      size={14}
                      color={foundCount > 0 ? Colors.success : Colors.error}
                    />
                    <Text style={[
                      styles.foundText,
                      { color: foundCount > 0 ? Colors.success : Colors.error }
                    ]}>
                      {foundCount > 0 ? `${foundCount} فیلد یافت شد` : 'فیلدی یافت نشد'}
                    </Text>
                  </View>
                  <Text style={styles.previewTitle}>پیش‌نمایش</Text>
                </View>

                {fields.map((field) => (
                  <View key={field.label} style={[
                    styles.fieldRow,
                    { backgroundColor: field.value ? field.bg : Colors.borderLight },
                    !field.value && styles.fieldRowEmpty,
                  ]}>
                    <View style={styles.fieldRowRight}>
                      <Text style={[
                        styles.fieldRowLabel,
                        { color: field.value ? field.color : Colors.textMuted }
                      ]}>
                        {field.label}
                      </Text>
                      <Text style={[
                        styles.fieldRowValue,
                        { color: field.value ? field.color : Colors.textMuted }
                      ]}>
                        {field.value ?? '—'}
                      </Text>
                    </View>
                    <MaterialIcons
                      name={field.value ? 'check-circle' : 'radio-button-unchecked'}
                      size={18}
                      color={field.value ? field.color : Colors.border}
                    />
                  </View>
                ))}

                {/* Save Button */}
                <Pressable
                  style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.85 }]}
                  onPress={handleSave}
                >
                  <MaterialIcons name="save-alt" size={20} color="#fff" />
                  <Text style={styles.saveBtnText}>ذخیره در لیست</Text>
                </Pressable>
              </View>
            ) : null}

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
    maxHeight: '90%',
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
  scroll: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'right',
    marginBottom: Spacing.xs,
  },
  textArea: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    minHeight: 140,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 26,
    textAlign: 'right',
  },
  extractBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    marginTop: Spacing.sm + 4,
    ...Shadow.sm,
  },
  extractBtnDisabled: {
    backgroundColor: Colors.textMuted,
  },
  extractBtnText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  preview: {
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  previewHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  previewTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  foundBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  foundText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  fieldRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: BorderRadius.sm + 2,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  fieldRowEmpty: {
    opacity: 0.6,
  },
  fieldRowRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  fieldRowLabel: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    opacity: 0.8,
  },
  fieldRowValue: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginTop: 2,
  },
  saveBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.success,
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
