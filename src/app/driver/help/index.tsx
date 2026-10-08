import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { driverFaqs } from '@/constants/driverMockData';
import { useDriver } from '@/context/DriverContext';

type HelpTab = 'FAQS' | 'TICKET' | 'GUIDES';

export default function HelpCenterScreen() {
  const { raiseTicket, tickets } = useDriver();
  const [activeTab, setActiveTab] = useState<HelpTab>('FAQS');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Ticket state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Payment & Settlement');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);

  const handleRaiseTicket = () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      Alert.alert('Incomplete Form', 'Please provide a subject and details for your support ticket.');
      return;
    }

    const t = raiseTicket(ticketCategory, ticketSubject, ticketMessage);
    setTicketSubject('');
    setTicketMessage('');
    setTicketSuccess(`Support Ticket #${t.ticketNumber} created successfully! Our help desk will respond shortly.`);
    setTimeout(() => setTicketSuccess(null), 5000);
  };

  const guides = [
    {
      title: 'How to Win More Bids on Haul360',
      desc: 'Tips for competitive freight pricing, fast responses, and keeping a 5-star rating.',
      icon: 'trending-up-outline',
    },
    {
      title: 'Maximizing Return Load Revenue',
      desc: 'How to set up corridor alerts and book backhauls before arriving at destination.',
      icon: 'repeat-outline',
    },
    {
      title: 'Emergency Breakdown & Highway Safety Protocol',
      desc: 'Step-by-step instructions for placing emergency markers and requesting roadside rescue.',
      icon: 'shield-checkmark-outline',
    },
  ];

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Driver Help Center</Text>
          <Text style={styles.headerSubtitle}>24/7 Roadside Assistance & Driver Support</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(
          [
            { id: 'FAQS', label: 'FAQs' },
            { id: 'TICKET', label: 'Raise Ticket' },
            { id: 'GUIDES', label: 'Driver Guides' },
          ] as { id: HelpTab; label: string }[]
        ).map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabBtn, isSelected && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabBtnText, isSelected && styles.tabBtnTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Urgent Helpline Card */}
        <View style={styles.helplineCard}>
          <View style={styles.helplineLeft}>
            <View style={styles.helplineIcon}>
              <Ionicons name="headset" size={22} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.helplineTitle}>24/7 Driver Support Line</Text>
              <Text style={styles.helplineNum}>1800-428-5360 (Toll-Free)</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.callNowBtn}
            onPress={() => Alert.alert('Simulating Call', 'Connecting to Haul360 Toll-Free Support Desk (1800-428-5360).')}
          >
            <Text style={styles.callNowBtnText}>Call Now</Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: FAQS ACCORDION */}
        {activeTab === 'FAQS' && (
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Frequently Asked Questions</Text>

            {driverFaqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <View key={idx} style={styles.faqItem}>
                  <TouchableOpacity
                    style={styles.faqQuestionRow}
                    onPress={() => setExpandedFaq(isExpanded ? null : idx)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.faqQuestionText}>{faq.question}</Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={colors.navy}
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* TAB 2: RAISE SUPPORT TICKET */}
        {activeTab === 'TICKET' && (
          <>
            {ticketSuccess && (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={20} color="#15803D" />
                <Text style={styles.successText}>{ticketSuccess}</Text>
              </View>
            )}

            <View style={styles.card}>
              <Text style={styles.cardHeading}>Create a Support Ticket</Text>

              <Text style={styles.inputLabel}>Issue Category</Text>
              <View style={styles.categoryPills}>
                {[
                  'Payment & Settlement',
                  'Shipment / Cargo',
                  'Mechanic Service',
                  'FASTag Dispute',
                  'Account & KYC',
                ].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.catPill,
                      ticketCategory === cat && styles.catPillActive,
                    ]}
                    onPress={() => setTicketCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.catPillText,
                        ticketCategory === cat && styles.catPillTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput
                style={styles.textInput}
                value={ticketSubject}
                onChangeText={setTicketSubject}
                placeholder="e.g. Delayed POD escrow release for SH-1039"
                placeholderTextColor="#94A3B8"
              />

              <Text style={styles.inputLabel}>Detailed Description</Text>
              <TextInput
                style={[styles.textInput, { height: 90, textAlignVertical: 'top' }]}
                multiline
                numberOfLines={4}
                value={ticketMessage}
                onChangeText={setTicketMessage}
                placeholder="Explain the problem and include any trip ID or toll plaza location..."
                placeholderTextColor="#94A3B8"
              />

              <TouchableOpacity
                style={styles.submitTicketBtn}
                onPress={handleRaiseTicket}
                activeOpacity={0.85}
              >
                <Text style={styles.submitTicketBtnText}>Submit Priority Ticket</Text>
              </TouchableOpacity>
            </View>

            {/* Submitted Tickets History */}
            {tickets.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardHeading}>Your Submitted Tickets ({tickets.length})</Text>
                {tickets.map((t) => (
                  <View key={t.id} style={styles.ticketItem}>
                    <View style={styles.ticketHeader}>
                      <Text style={styles.ticketNum}>{t.ticketNumber}</Text>
                      <View style={styles.ticketStatusBadge}>
                        <Text style={styles.ticketStatusText}>{t.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.ticketSubj}>{t.subject}</Text>
                    <Text style={styles.ticketResponse}>{t.responseMessage}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* TAB 3: GUIDES */}
        {activeTab === 'GUIDES' && (
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Independent Driver Playbooks</Text>

            {guides.map((g, idx) => (
              <TouchableOpacity key={idx} style={styles.guideCard} activeOpacity={0.8}>
                <View style={styles.guideIcon}>
                  <Ionicons name={g.icon as any} size={22} color={colors.navy} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.guideTitle}>{g.title}</Text>
                  <Text style={styles.guideDesc}>{g.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: colors.navy,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabBtnTextActive: {
    color: colors.navy,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  helplineCard: {
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  helplineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  helplineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helplineTitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  helplineNum: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 1,
  },
  callNowBtn: {
    backgroundColor: colors.green,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  callNowBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  cardHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.md,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: spacing.sm,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
    flex: 1,
    marginRight: spacing.sm,
  },
  faqAnswerText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  successText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#15803D',
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 6,
  },
  categoryPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  catPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
  },
  catPillActive: {
    backgroundColor: colors.navy,
  },
  catPillText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  catPillTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 12,
    color: colors.navy,
    marginBottom: spacing.md,
    backgroundColor: '#F8FAFC',
  },
  submitTicketBtn: {
    backgroundColor: colors.navy,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitTicketBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  ticketItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketNum: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
  },
  ticketStatusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  ticketStatusText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#B45309',
  },
  ticketSubj: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
    marginTop: 2,
  },
  ticketResponse: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  guideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: spacing.sm,
  },
  guideIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
  },
  guideDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },
});
