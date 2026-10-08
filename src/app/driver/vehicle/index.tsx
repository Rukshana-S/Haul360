import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { StatusBadge } from '@/components/driver/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { useDriver } from '@/context/DriverContext';
import { DriverVehicle } from '@/constants/driverMockData';

const TRUCK_TYPES = [
  '10-Wheeler Multi-Axle Truck',
  '6-Wheeler Medium Haul Truck',
  '14-Wheeler Heavy Trailer',
  'Closed Container / Dry Van',
  'Open High-Side Flatbed',
  'Refrigerated Container',
];

const FUEL_TYPES = ['Diesel', 'CNG', 'Electric', 'LNG'];

export default function DriverVehicleScreen() {
  const {
    vehicles,
    activeVehicleId,
    vehicle,
    selectVehicle,
    addVehicle,
    updateVehicle,
  } = useDriver();

  // Edit Truck Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [modelInput, setModelInput] = useState(vehicle.model);
  const [capacityInput, setCapacityInput] = useState(vehicle.capacityKg.toString());
  const [bodyTypeInput, setBodyTypeInput] = useState(vehicle.bodyType);

  // Add Truck Modal State
  const [addTruckModalVisible, setAddTruckModalVisible] = useState(false);
  const [newVehNumber, setNewVehNumber] = useState('');
  const [newVehType, setNewVehType] = useState(TRUCK_TYPES[0]);
  const [newVehModel, setNewVehModel] = useState('');
  const [newVehCapacity, setNewVehCapacity] = useState('10');
  const [newVehFuel, setNewVehFuel] = useState('Diesel');
  const [newVehYear, setNewVehYear] = useState('2022');

  const [newRcAttached, setNewRcAttached] = useState(true);
  const [newInsAttached, setNewInsAttached] = useState(true);
  const [newPermitAttached, setNewPermitAttached] = useState(true);
  const [newFitnessAttached, setNewFitnessAttached] = useState(true);

  const [addErrors, setAddErrors] = useState<Record<string, string>>({});

  const handleOpenEdit = () => {
    setModelInput(vehicle.model);
    setCapacityInput(vehicle.capacityKg.toString());
    setBodyTypeInput(vehicle.bodyType);
    setEditModalVisible(true);
  };

  const handleSaveSpecs = () => {
    const capKg = parseInt(capacityInput) || 10000;
    updateVehicle({
      model: modelInput,
      capacityKg: capKg,
      capacityTons: Math.round(capKg / 1000),
      bodyType: bodyTypeInput,
    });
    setEditModalVisible(false);
    Alert.alert('Vehicle Updated', 'Your vehicle specifications have been saved.');
  };

  const handleAddTruck = () => {
    const errs: Record<string, string> = {};
    if (!newVehNumber.trim()) {
      errs.newVehNumber = 'Vehicle number is required (e.g. TN 37 CY 8820)';
    }
    if (!newVehModel.trim()) {
      errs.newVehModel = 'Vehicle model is required (e.g. Ashok Leyland 1920)';
    }
    const cap = parseFloat(newVehCapacity);
    if (!newVehCapacity.trim() || isNaN(cap) || cap <= 0) {
      errs.newVehCapacity = 'Valid capacity in tonnes is required';
    }

    if (Object.keys(errs).length > 0) {
      setAddErrors(errs);
      return;
    }

    const capKg = Math.round(parseFloat(newVehCapacity) * 1000);
    const result = addVehicle({
      vehicleNumber: newVehNumber.trim().toUpperCase(),
      model: newVehModel.trim(),
      vehicleType: newVehType,
      capacityKg: capKg,
      capacityTons: Math.round(capKg / 1000),
      bodyType: 'Closed Container / Dry Van',
      fuelType: newVehFuel,
      year: parseInt(newVehYear) || new Date().getFullYear(),
      rcStatus: newRcAttached ? 'VERIFIED' : 'PENDING',
      insuranceStatus: newInsAttached ? 'VERIFIED' : 'PENDING',
      permitStatus: newPermitAttached ? 'VERIFIED' : 'PENDING',
      fitnessStatus: newFitnessAttached ? 'VERIFIED' : 'PENDING',
      fastagStatus: 'ACTIVE',
      fastagBalance: 1500,
    });

    if (!result.success) {
      Alert.alert('Registration Error', result.message);
      return;
    }

    // Reset & Close
    setAddTruckModalVisible(false);
    setNewVehNumber('');
    setNewVehModel('');
    setNewVehCapacity('10');
    setAddErrors({});
    if (result.vehicleId) {
      selectVehicle(result.vehicleId);
    }
    Alert.alert('Truck Registered', result.message);
  };

  return (
    <Screen safeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Fleet Documents & Trucks</Text>
          <Text style={styles.headerSubtitle}>Independent Commercial Vehicle Assets</Text>
        </View>
        <TouchableOpacity
          style={styles.addTruckTopBtn}
          onPress={() => setAddTruckModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={16} color={colors.white} />
          <Text style={styles.addTruckTopBtnText}>Add Truck</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TRUCK SWITCHER / SELECTOR */}
        {vehicles.length > 1 && (
          <View style={styles.truckSwitcherContainer}>
            <Text style={styles.switcherLabel}>Active Fleet Truck:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.truckSwitcherScroll}>
              {vehicles.map((v) => {
                const isSelected = v.id === activeVehicleId;
                return (
                  <TouchableOpacity
                    key={v.id}
                    style={[styles.switcherTab, isSelected && styles.switcherTabActive]}
                    onPress={() => selectVehicle(v.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="car-sport"
                      size={16}
                      color={isSelected ? colors.white : colors.navy}
                    />
                    <Text style={[styles.switcherTabText, isSelected && styles.switcherTabTextActive]}>
                      {v.vehicleNumber} ({v.capacityTons}T)
                    </Text>
                    {isSelected && (
                      <View style={styles.activeDot} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* ACTIVE TRUCK HERO PROFILE */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.truckIconCircle}>
              <Ionicons name="car-sport" size={26} color={colors.navy} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.regNumber}>{vehicle.vehicleNumber}</Text>
                {vehicle.id === activeVehicleId && (
                  <View style={styles.primaryBadge}>
                    <Text style={styles.primaryBadgeText}>ACTIVE TRUCK</Text>
                  </View>
                )}
              </View>
              <Text style={styles.modelName}>{vehicle.model}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={handleOpenEdit}>
              <Ionicons name="pencil" size={14} color={colors.navy} />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroSpecsRow}>
            <View style={styles.heroSpec}>
              <Text style={styles.heroSpecLabel}>Payload Capacity</Text>
              <Text style={styles.heroSpecVal}>
                {vehicle.capacityTons} Tonnes ({vehicle.capacityKg.toLocaleString('en-IN')} kg)
              </Text>
            </View>
            <View style={styles.heroSpec}>
              <Text style={styles.heroSpecLabel}>Truck Format</Text>
              <Text style={styles.heroSpecVal}>{vehicle.vehicleType}</Text>
            </View>
          </View>
        </View>

        {/* FASTAG STATUS FOR ACTIVE TRUCK */}
        <TouchableOpacity
          style={styles.fastagBanner}
          onPress={() => router.push('/driver/fastag' as any)}
          activeOpacity={0.85}
        >
          <View style={styles.fastagIconBox}>
            <Ionicons name="card" size={22} color={colors.navy} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fastagTitle}>NETC FASTag ({vehicle.vehicleNumber.slice(-4)})</Text>
            <Text style={styles.fastagSub}>
              Balance: ₹{(vehicle.fastagBalance || 2450).toLocaleString('en-IN')} • Tag #{vehicle.fastagTagId}
            </Text>
          </View>
          <StatusBadge status={vehicle.fastagStatus} size="sm" />
        </TouchableOpacity>

        {/* FLEET COMPLIANCE DOCUMENTS SECTION */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.navy} />
            <Text style={styles.cardHeading}>Compliance & Fleet Documents</Text>
          </View>

          {/* RC */}
          <View style={styles.specItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.specLabel}>Registration Certificate (RC)</Text>
              <Text style={styles.specVal}>
                {vehicle.rcNumber} • Expiry: {vehicle.rcExpiry}
              </Text>
            </View>
            <StatusBadge status={vehicle.rcStatus} size="sm" />
          </View>

          {/* Insurance */}
          <View style={styles.specItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.specLabel}>Commercial Comprehensive Insurance</Text>
              <Text style={styles.specVal}>
                {vehicle.insuranceNumber} • Expiry: {vehicle.insuranceExpiry}
              </Text>
            </View>
            <StatusBadge status={vehicle.insuranceStatus} size="sm" />
          </View>

          {/* National Permit */}
          <View style={styles.specItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.specLabel}>All-India National Permit (AITP)</Text>
              <Text style={styles.specVal}>
                {vehicle.permitNumber} • Expiry: {vehicle.permitExpiry}
              </Text>
            </View>
            <StatusBadge status={vehicle.permitStatus} size="sm" />
          </View>

          {/* Fitness Certificate */}
          <View style={[styles.specItem, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.specLabel}>Vehicle Fitness Certificate</Text>
              <Text style={styles.specVal}>
                {vehicle.fitnessNumber || 'FIT-TN-2023-8821'} • Expiry: {vehicle.fitnessExpiry || '14 Oct 2027'}
              </Text>
            </View>
            <StatusBadge status={vehicle.fitnessStatus || 'VERIFIED'} size="sm" />
          </View>
        </View>

        {/* TECHNICAL ATTRIBUTES */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Technical Attributes</Text>

          <View style={styles.attributeRow}>
            <Text style={styles.attrLabel}>Axle Configuration</Text>
            <Text style={styles.attrVal}>Multi-Axle Commercial Carrier</Text>
          </View>
          <View style={styles.attributeRow}>
            <Text style={styles.attrLabel}>Fuel Type</Text>
            <Text style={styles.attrVal}>{vehicle.fuelType}</Text>
          </View>
          <View style={styles.attributeRow}>
            <Text style={styles.attrLabel}>Manufacturing Year</Text>
            <Text style={styles.attrVal}>{vehicle.year || 2022}</Text>
          </View>
          <View style={[styles.attributeRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.attrLabel}>Haul360 Telematics Sync</Text>
            <Text style={[styles.attrVal, { color: colors.green }]}>OBD-II Active</Text>
          </View>
        </View>

        {/* ADD ANOTHER TRUCK BUTTON */}
        <TouchableOpacity
          style={styles.addTruckFullBtn}
          onPress={() => setAddTruckModalVisible(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle-outline" size={20} color={colors.white} />
          <Text style={styles.addTruckFullBtnText}>+ Register Additional Truck to Fleet</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* EDIT VEHICLE SPECS MODAL */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Edit Truck Specifications</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.navy} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Make & Model</Text>
            <TextInput
              style={styles.modalInput}
              value={modelInput}
              onChangeText={setModelInput}
            />

            <Text style={styles.inputLabel}>Payload Capacity in Kilograms (kg)</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={capacityInput}
              onChangeText={setCapacityInput}
            />

            <Text style={styles.inputLabel}>Body Format</Text>
            <TextInput
              style={styles.modalInput}
              value={bodyTypeInput}
              onChangeText={setBodyTypeInput}
            />

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSaveSpecs}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>Save Truck Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ADD NEW TRUCK MODAL */}
      <Modal
        visible={addTruckModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddTruckModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { maxHeight: '90%' }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Add Commercial Truck</Text>
              <TouchableOpacity onPress={() => setAddTruckModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.navy} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Commercial Vehicle Number *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. TN 37 CY 8820"
                autoCapitalize="characters"
                value={newVehNumber}
                onChangeText={(v) => {
                  setNewVehNumber(v);
                  if (addErrors.newVehNumber) setAddErrors((prev) => ({ ...prev, newVehNumber: '' }));
                }}
              />
              {addErrors.newVehNumber && <Text style={styles.errorText}>{addErrors.newVehNumber}</Text>}

              <Text style={styles.inputLabel}>Make & Model *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Ashok Leyland 1920 6x2"
                value={newVehModel}
                onChangeText={(v) => {
                  setNewVehModel(v);
                  if (addErrors.newVehModel) setAddErrors((prev) => ({ ...prev, newVehModel: '' }));
                }}
              />
              {addErrors.newVehModel && <Text style={styles.errorText}>{addErrors.newVehModel}</Text>}

              <Text style={styles.inputLabel}>Vehicle Type *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.sm }}>
                {TRUCK_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typePillModal, newVehType === t && styles.typePillModalActive]}
                    onPress={() => setNewVehType(t)}
                  >
                    <Text style={[styles.typePillModalText, newVehType === t && styles.typePillModalTextActive]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.twoColRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Capacity (Tonnes) *</Text>
                  <TextInput
                    style={styles.modalInput}
                    keyboardType="numeric"
                    placeholder="e.g. 6"
                    value={newVehCapacity}
                    onChangeText={setNewVehCapacity}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Mfg Year</Text>
                  <TextInput
                    style={styles.modalInput}
                    keyboardType="numeric"
                    placeholder="e.g. 2022"
                    value={newVehYear}
                    onChangeText={setNewVehYear}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Compliance Documents</Text>
              <View style={styles.docToggleList}>
                <TouchableOpacity
                  style={styles.docToggleRow}
                  onPress={() => setNewRcAttached(!newRcAttached)}
                >
                  <Ionicons
                    name={newRcAttached ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={colors.navy}
                  />
                  <Text style={styles.docToggleText}>Vehicle RC Certificate</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.docToggleRow}
                  onPress={() => setNewInsAttached(!newInsAttached)}
                >
                  <Ionicons
                    name={newInsAttached ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={colors.navy}
                  />
                  <Text style={styles.docToggleText}>Commercial Comprehensive Insurance</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.docToggleRow}
                  onPress={() => setNewPermitAttached(!newPermitAttached)}
                >
                  <Ionicons
                    name={newPermitAttached ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={colors.navy}
                  />
                  <Text style={styles.docToggleText}>All-India National Permit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.docToggleRow}
                  onPress={() => setNewFitnessAttached(!newFitnessAttached)}
                >
                  <Ionicons
                    name={newFitnessAttached ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={colors.navy}
                  />
                  <Text style={styles.docToggleText}>Fitness Inspection Certificate</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleAddTruck}
                activeOpacity={0.85}
              >
                <Text style={styles.saveBtnText}>Register Truck to Fleet</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  addTruckTopBtn: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
    gap: 4,
  },
  addTruckTopBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  truckSwitcherContainer: {
    marginBottom: spacing.md,
  },
  switcherLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  truckSwitcherScroll: {
    gap: spacing.xs,
  },
  switcherTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
    gap: 6,
  },
  switcherTabActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  switcherTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  switcherTabTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  truckIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  regNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.navy,
    letterSpacing: 0.5,
  },
  primaryBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  primaryBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#15803D',
  },
  modelName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: radius.md,
    gap: 4,
  },
  editBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.navy,
  },
  heroSpecsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  heroSpec: {
    flex: 1,
  },
  heroSpecLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  heroSpecVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: 2,
  },
  fastagBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  fastagIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fastagTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  fastagSub: {
    fontSize: 11,
    color: colors.blue,
    marginTop: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  cardHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.navy,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  specLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  specVal: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  attributeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  attrLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  attrVal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  addTruckFullBtn: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.md,
    gap: spacing.xs,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  addTruckFullBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.navy,
    marginTop: spacing.xs,
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 13,
    color: colors.navy,
    marginBottom: spacing.xs,
    backgroundColor: '#F8FAFC',
  },
  twoColRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typePillModal: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: '#F1F5F9',
    marginRight: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typePillModalActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  typePillModalText: {
    fontSize: 11,
    color: colors.navy,
  },
  typePillModalTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  docToggleList: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  docToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 2,
  },
  docToggleText: {
    fontSize: 12,
    color: colors.navy,
  },
  errorText: {
    color: colors.error,
    fontSize: 11,
    marginBottom: 4,
  },
  saveBtn: {
    backgroundColor: colors.navy,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
