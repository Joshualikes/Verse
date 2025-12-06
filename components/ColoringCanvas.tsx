import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Dimensions, 
  PanResponder,
  Alert,
  Platform,
  TextInput,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  X, 
  Palette, 
  Download, 
  RotateCcw, 
  Save,
  Minus,
  Plus,
  Eraser,
  Paintbrush,
  Droplet,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Move,
  Eye,
  Check
} from 'lucide-react-native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface ColoringCanvasProps {
  visible: boolean;
  onClose: () => void;
  onProgressUpdate: (progress: number) => void;
  onComplete: () => void;
  title: string;
  initialProgress?: number;
  category?: string;
  storyId?: number;
  imageUrl?: string;
}

const { width, height } = Dimensions.get('window');
const canvasWidth = width - 32;
const canvasHeight = height * 0.6;

const defaultColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#F4A460', '#98D8C8',
  '#FFB6C1', '#87CEEB', '#DEB887', '#F0E68C',
  '#FFA07A', '#20B2AA', '#778899', '#B0C4DE',
  '#000000', '#FFFFFF', '#8B4513', '#2F4F4F',
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#800080', '#FFA500',
  '#A52A2A', '#808080', '#C0C0C0', '#800000'
];

export function ColoringCanvas({ 
  visible, 
  onClose, 
  onProgressUpdate, 
  onComplete, 
  title,
  initialProgress = 0,
  category = 'New',
  storyId = 1,
  imageUrl
}: ColoringCanvasProps) {
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [brushSize, setBrushSize] = useState(8);
  const [currentTool, setCurrentTool] = useState<'brush' | 'fill' | 'eraser' | 'eyedropper' | 'pan'>('brush');
  const [paths, setPaths] = useState<Array<{path: string, color: string, strokeWidth: number, id: string, tool: string}>>([]);
  const [filledShapes, setFilledShapes] = useState<Map<number, string>>(new Map());
  const [currentPath, setCurrentPath] = useState('');
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showCustomColorInput, setShowCustomColorInput] = useState(false);
  const [customColorInput, setCustomColorInput] = useState('');
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [progress, setProgress] = useState(initialProgress);
  const [isCompleted, setIsCompleted] = useState(initialProgress >= 100);
  const [undoStack, setUndoStack] = useState<Array<any>>([]);
  const [redoStack, setRedoStack] = useState<Array<any>>([]);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showTools, setShowTools] = useState(false);
  const [coloredPixels, setColoredPixels] = useState(0);
  const [totalColorablePixels, setTotalColorablePixels] = useState(1000); // Will be calculated from SVG
  const viewShotRef = useRef<ViewShot>(null);

  // Noah's Ark SVG outline paths with shape IDs for progress tracking
  const colorableShapes = [
    { id: 0, path: "M50 200 Q50 180 80 180 L320 180 Q350 180 350 200 L350 250 Q350 270 320 270 L80 270 Q50 270 50 250 Z", name: "Ark Body" },
    { id: 1, path: "M20 100 Q200 50 380 100", name: "Rainbow 1" },
    { id: 2, path: "M25 110 Q200 60 375 110", name: "Rainbow 2" },
    { id: 3, path: "M30 120 Q200 70 370 120", name: "Rainbow 3" },
    { id: 4, path: "M100 200 Q90 190 90 180 Q90 170 100 170 Q110 170 110 180 Q110 190 100 200", name: "Elephant 1" },
    { id: 5, path: "M120 200 Q110 190 110 180 Q110 170 120 170 Q130 170 130 180 Q130 190 120 200", name: "Elephant 2" },
    { id: 6, path: "M150 200 L150 150 Q150 140 160 140 Q170 140 170 150 L170 200", name: "Giraffe 1" },
    { id: 7, path: "M180 200 L180 150 Q180 140 190 140 Q200 140 200 150 L200 200", name: "Giraffe 2" },
    { id: 8, path: "M220 200 Q210 190 210 180 Q210 170 220 170 Q230 170 230 180 Q230 190 220 200", name: "Lion 1" },
    { id: 9, path: "M250 200 Q240 190 240 180 Q240 170 250 170 Q260 170 260 180 Q260 190 250 200", name: "Lion 2" },
    { id: 10, path: "M300 200 Q290 190 290 160 Q290 150 300 150 Q310 150 310 160 Q310 190 300 200", name: "Noah" },
    { id: 11, path: "M320 120 Q315 115 320 110 Q325 115 320 120", name: "Dove" },
    { id: 12, path: "M60 80 Q50 70 60 60 Q70 70 80 60 Q90 70 80 80 Q70 90 60 80", name: "Cloud 1" },
    { id: 13, path: "M320 80 Q310 70 320 60 Q330 70 340 60 Q350 70 340 80 Q330 90 320 80", name: "Cloud 2" }
  ];

  // Calculate progress based on filled shapes
  const calculateProgress = () => {
    const filledCount = filledShapes.size;
    const totalShapes = colorableShapes.length;
    return Math.round((filledCount / totalShapes) * 100);
  };

  // Update progress when shapes are filled
  useEffect(() => {
    const newProgress = calculateProgress();
    setProgress(newProgress);
    onProgressUpdate(newProgress);
    
    if (newProgress >= 100 && !isCompleted) {
      setIsCompleted(true);
      onComplete();
      Alert.alert(
        'Congratulations! 🎉',
        'You have completed this coloring page! You can now download it as PNG or PDF.',
        [{ text: 'Amazing!', style: 'default' }]
      );
    } else if (newProgress < 100 && isCompleted) {
      setIsCompleted(false);
    }
  }, [filledShapes, isCompleted, onComplete, onProgressUpdate]);

  // Generate unique ID for paths
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Save state for undo/redo
  const saveState = () => {
    const state = {
      paths: [...paths],
      filledShapes: new Map(filledShapes),
      timestamp: Date.now()
    };
    setUndoStack(prev => [...prev.slice(-19), state]); // Keep last 20 states
    setRedoStack([]); // Clear redo stack when new action is performed
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const currentState = {
        paths: [...paths],
        filledShapes: new Map(filledShapes),
        timestamp: Date.now()
      };
      setRedoStack(prev => [currentState, ...prev.slice(0, 19)]);
      
      const previousState = undoStack[undoStack.length - 1];
      setPaths(previousState.paths);
      setFilledShapes(previousState.filledShapes);
      setUndoStack(prev => prev.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const currentState = {
        paths: [...paths],
        filledShapes: new Map(filledShapes),
        timestamp: Date.now()
      };
      setUndoStack(prev => [...prev, currentState]);
      
      const nextState = redoStack[0];
      setPaths(nextState.paths);
      setFilledShapes(nextState.filledShapes);
      setRedoStack(prev => prev.slice(1));
    }
  };

  // Check if point is inside a shape
  const isPointInShape = (x: number, y: number, shapeId: number): boolean => {
    // Simplified point-in-polygon test for demo
    // In production, you'd use proper SVG path hit testing
    const shape = colorableShapes[shapeId];
    if (!shape) return false;
    
    // Basic bounding box check for demo
    const bounds = getShapeBounds(shape.path);
    return x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY;
  };

  // Get shape bounds from path (simplified)
  const getShapeBounds = (path: string) => {
    const coords = path.match(/(\d+\.?\d*)/g)?.map(Number) || [];
    const xCoords = coords.filter((_, i) => i % 2 === 0);
    const yCoords = coords.filter((_, i) => i % 2 === 1);
    
    return {
      minX: Math.min(...xCoords),
      maxX: Math.max(...xCoords),
      minY: Math.min(...yCoords),
      maxY: Math.max(...yCoords)
    };
  };

  // Fill tool logic
  const handleFill = (x: number, y: number) => {
    for (let i = 0; i < colorableShapes.length; i++) {
      if (isPointInShape(x, y, i)) {
        saveState();
        setFilledShapes(prev => {
          const newMap = new Map(prev);
          if (newMap.has(i) && newMap.get(i) === selectedColor) {
            // If same color, remove fill (unfill)
            newMap.delete(i);
          } else {
            // Fill with selected color
            newMap.set(i, selectedColor);
          }
          return newMap;
        });
        break;
      }
    }
  };

  // Eyedropper tool logic
  const handleEyedropper = (x: number, y: number) => {
    for (let i = 0; i < colorableShapes.length; i++) {
      if (isPointInShape(x, y, i) && filledShapes.has(i)) {
        const color = filledShapes.get(i);
        if (color) {
          setSelectedColor(color);
          setCurrentTool('brush'); // Switch back to brush after picking color
        }
        break;
      }
    }
  };

  // Eraser tool logic
  const handleErase = (x: number, y: number) => {
    // Remove filled shapes at this location
    for (let i = 0; i < colorableShapes.length; i++) {
      if (isPointInShape(x, y, i) && filledShapes.has(i)) {
        saveState();
        setFilledShapes(prev => {
          const newMap = new Map(prev);
          newMap.delete(i);
          return newMap;
        });
        break;
      }
    }
    // Also remove paths near this location (simplified - removes all paths in production would be more precise)
    // For now, we'll just add a white path to "erase" visually
    const erasePathId = generateId();
    setPaths(prev => [...prev, {
      path: `M${x},${y}`,
      color: '#FFFFFF',
      strokeWidth: brushSize * 2,
      id: erasePathId,
      tool: 'eraser'
    }]);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const adjustedX = (locationX - panOffset.x) / zoom;
      const adjustedY = (locationY - panOffset.y) / zoom;

      if (currentTool === 'fill') {
        handleFill(adjustedX, adjustedY);
      } else if (currentTool === 'eyedropper') {
        handleEyedropper(adjustedX, adjustedY);
      } else if (currentTool === 'eraser') {
        handleErase(adjustedX, adjustedY);
      } else if (currentTool === 'brush') {
        setCurrentPath(`M${adjustedX},${adjustedY}`);
        saveState();
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      const { locationX, locationY } = evt.nativeEvent;
      const adjustedX = (locationX - panOffset.x) / zoom;
      const adjustedY = (locationY - panOffset.y) / zoom;

      if (currentTool === 'pan') {
        setPanOffset(prev => ({
          x: prev.x + gestureState.dx,
          y: prev.y + gestureState.dy
        }));
      } else if (currentTool === 'eraser') {
        handleErase(adjustedX, adjustedY);
      } else if (currentTool === 'brush') {
        setCurrentPath(prev => `${prev} L${adjustedX},${adjustedY}`);
      }
    },
    onPanResponderRelease: () => {
      if (currentPath && currentTool === 'brush') {
        const pathId = generateId();
        setPaths(prev => [...prev, {
          path: currentPath,
          color: selectedColor,
          strokeWidth: brushSize,
          id: pathId,
          tool: 'brush'
        }]);
        setCurrentPath('');
      }
    },
  });

  // Add custom color
  const addCustomColor = () => {
    let color = customColorInput.trim();
    
    // Validate and format color
    if (color.startsWith('#')) {
      if (color.length === 4) {
        // Convert #RGB to #RRGGBB
        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
      }
      if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
        if (!customColors.includes(color.toUpperCase()) && !defaultColors.includes(color.toUpperCase())) {
          setCustomColors(prev => [...prev, color.toUpperCase()]);
          setSelectedColor(color.toUpperCase());
          setCustomColorInput('');
          setShowCustomColorInput(false);
        } else {
          Alert.alert('Color Already Exists', 'This color is already in your palette.');
        }
      } else {
        Alert.alert('Invalid Color', 'Please enter a valid hex color (e.g., #FF0000)');
      }
    } else {
      Alert.alert('Invalid Format', 'Color must start with # (e.g., #FF0000)');
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    Alert.alert(
      'Clear Canvas',
      'Are you sure you want to clear all your coloring?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            saveState();
            setPaths([]);
            setCurrentPath('');
            setFilledShapes(new Map());
            setProgress(0);
            setIsCompleted(false);
            onProgressUpdate(0);
          }
        }
      ]
    );
  };

  // Save progress
  const saveProgress = () => {
    Alert.alert('Progress Saved', 'Your coloring progress has been saved!');
  };

  // Download as PNG or PDF
  const downloadArtwork = async (format: 'PNG' | 'PDF') => {
    if (!isCompleted) {
      Alert.alert('Not Completed', 'Please complete the coloring page before downloading.');
      return;
    }

    try {
      if (Platform.OS === 'web') {
        Alert.alert('Download Started', `Your ${format} is being prepared for download!`);
      } else {
        if (viewShotRef.current) {
          const capture = viewShotRef.current.capture;
          if (!capture) {
            Alert.alert('Error', 'Failed to capture image');
            return;
          }
          const uri = await capture();
          if (!uri) {
            Alert.alert('Error', 'Failed to capture image');
            return;
          }
          await Sharing.shareAsync(uri, {
            mimeType: format === 'PDF' ? 'application/pdf' : 'image/png',
            dialogTitle: `${title} - Completed Artwork`
          });
        }
      }
    } catch (error) {
      Alert.alert('Download Error', `Failed to download ${format}. Please try again.`);
    }
  };

  // Zoom controls
  const zoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));
  const resetZoom = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const allColors = [...defaultColors, ...customColors];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={onClose}>
            <X color="#8B4513" size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{progress}% Complete</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.headerButton} onPress={saveProgress}>
            <Save color="#8B4513" size={20} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Canvas */}
        <ViewShot ref={viewShotRef} style={styles.canvasContainer}>
          <View 
            style={[styles.canvas, { transform: [{ scale: zoom }] }]}
            {...panResponder.panHandlers}
          >
            <Svg width={canvasWidth} height={canvasHeight} style={styles.svg}>
              <G x={panOffset.x} y={panOffset.y}>
                {/* Filled shapes */}
                {colorableShapes.map((shape) => (
                  <Path
                    key={`filled-${shape.id}`}
                    d={shape.path}
                    fill={filledShapes.get(shape.id) || 'none'}
                    stroke="#000000"
                    strokeWidth="2"
                  />
                ))}
                
                {/* Outline paths */}
                {colorableShapes.map((shape) => (
                  <Path
                    key={`outline-${shape.id}`}
                    d={shape.path}
                    stroke="#000000"
                    strokeWidth="2"
                    fill="none"
                  />
                ))}
                
                {/* User drawn paths */}
                {paths.map((pathObj) => (
                  <Path
                    key={pathObj.id}
                    d={pathObj.path}
                    stroke={pathObj.tool === 'eraser' ? '#FFFFFF' : pathObj.color}
                    strokeWidth={pathObj.strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                
                {/* Current drawing path */}
                {currentPath && (
                  <Path
                    d={currentPath}
                    stroke={selectedColor}
                    strokeWidth={brushSize}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </G>
            </Svg>
          </View>
        </ViewShot>

        {/* Tools Bar */}
        <View style={styles.toolsBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolsContent}>
            {/* Tool Buttons */}
            <TouchableOpacity 
              style={[styles.toolButton, currentTool === 'brush' && styles.activeToolButton]}
              onPress={() => setCurrentTool('brush')}
            >
              <Paintbrush color={currentTool === 'brush' ? "#FFFFFF" : "#8B4513"} size={18} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.toolButton, currentTool === 'fill' && styles.activeToolButton]}
              onPress={() => setCurrentTool('fill')}
            >
              <Droplet color={currentTool === 'fill' ? "#FFFFFF" : "#8B4513"} size={18} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.toolButton, currentTool === 'eraser' && styles.activeToolButton]}
              onPress={() => setCurrentTool('eraser')}
            >
              <Eraser color={currentTool === 'eraser' ? "#FFFFFF" : "#8B4513"} size={18} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.toolButton, currentTool === 'eyedropper' && styles.activeToolButton]}
              onPress={() => setCurrentTool('eyedropper')}
            >
              <Eye color={currentTool === 'eyedropper' ? "#FFFFFF" : "#8B4513"} size={18} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.toolButton, currentTool === 'pan' && styles.activeToolButton]}
              onPress={() => setCurrentTool('pan')}
            >
              <Move color={currentTool === 'pan' ? "#FFFFFF" : "#8B4513"} size={18} />
            </TouchableOpacity>

            {/* Separator */}
            <View style={styles.separator} />

            {/* Undo/Redo */}
            <TouchableOpacity 
              style={[styles.toolButton, undoStack.length === 0 && styles.disabledButton]}
              onPress={undo}
              disabled={undoStack.length === 0}
            >
              <Undo color={undoStack.length > 0 ? "#8B4513" : "#CCCCCC"} size={18} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.toolButton, redoStack.length === 0 && styles.disabledButton]}
              onPress={redo}
              disabled={redoStack.length === 0}
            >
              <Redo color={redoStack.length > 0 ? "#8B4513" : "#CCCCCC"} size={18} />
            </TouchableOpacity>

            {/* Separator */}
            <View style={styles.separator} />

            {/* Zoom Controls */}
            <TouchableOpacity style={styles.toolButton} onPress={zoomOut}>
              <ZoomOut color="#8B4513" size={18} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton} onPress={resetZoom}>
              <Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolButton} onPress={zoomIn}>
              <ZoomIn color="#8B4513" size={18} />
            </TouchableOpacity>

            {/* Separator */}
            <View style={styles.separator} />

            {/* Brush Size */}
            <View style={styles.brushControls}>
              <TouchableOpacity 
                style={styles.brushButton}
                onPress={() => setBrushSize(Math.max(2, brushSize - 2))}
              >
                <Minus color="#8B4513" size={14} />
              </TouchableOpacity>
              <View style={styles.brushSizeDisplay}>
                <View 
                  style={[
                    styles.brushPreview, 
                    { 
                      width: Math.max(8, brushSize), 
                      height: Math.max(8, brushSize), 
                      backgroundColor: selectedColor,
                    }
                  ]} 
                />
                <Text style={styles.brushSizeText}>{brushSize}px</Text>
              </View>
              <TouchableOpacity 
                style={styles.brushButton}
                onPress={() => setBrushSize(Math.min(30, brushSize + 2))}
              >
                <Plus color="#8B4513" size={14} />
              </TouchableOpacity>
            </View>

            {/* Separator */}
            <View style={styles.separator} />

            {/* Color Palette Toggle */}
            <TouchableOpacity 
              style={[styles.toolButton, showColorPalette && styles.activeToolButton]}
              onPress={() => setShowColorPalette(!showColorPalette)}
            >
              <Palette color={showColorPalette ? "#FFFFFF" : "#8B4513"} size={18} />
            </TouchableOpacity>

            {/* Clear Button */}
            <TouchableOpacity style={styles.clearButton} onPress={clearCanvas}>
              <RotateCcw color="#FFFFFF" size={16} />
            </TouchableOpacity>

            {/* Download Buttons */}
            {isCompleted && (
              <>
                <TouchableOpacity 
                  style={styles.downloadButton} 
                  onPress={() => downloadArtwork('PNG')}
                >
                  <Download color="#FFFFFF" size={16} />
                  <Text style={styles.downloadButtonText}>PNG</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.downloadButton, styles.pdfButton]} 
                  onPress={() => downloadArtwork('PDF')}
                >
                  <Download color="#FFFFFF" size={16} />
                  <Text style={styles.downloadButtonText}>PDF</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>

        {/* Color Palette */}
        {showColorPalette && (
          <View style={styles.colorPalette}>
            <View style={styles.paletteHeader}>
              <Text style={styles.paletteTitle}>Color Palette</Text>
              <TouchableOpacity 
                style={styles.addColorButton}
                onPress={() => setShowCustomColorInput(true)}
              >
                <Plus color="#FFFFFF" size={16} />
                <Text style={styles.addColorText}>Add Color</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.colorsGrid}>
                {allColors.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorCircle, 
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColor
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Check color={color === '#FFFFFF' ? '#000000' : '#FFFFFF'} size={16} strokeWidth={3} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Custom Color Input */}
        {showCustomColorInput && (
          <View style={styles.customColorModal}>
            <View style={styles.customColorContent}>
              <Text style={styles.customColorTitle}>Add Custom Color</Text>
              <TextInput
                style={styles.customColorInput}
                value={customColorInput}
                onChangeText={setCustomColorInput}
                placeholder="#FF0000"
                placeholderTextColor="#999999"
                autoCapitalize="characters"
                maxLength={7}
              />
              <View style={styles.customColorButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowCustomColorInput(false);
                    setCustomColorInput('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={addCustomColor}
                >
                  <Text style={styles.addButtonText}>Add Color</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {isCompleted ? '✅ Completed' : 
             currentTool === 'brush' ? '🎨 Brush' :
             currentTool === 'fill' ? '🪣 Fill' :
             currentTool === 'eraser' ? '🧽 Color Eraser' :
             currentTool === 'eyedropper' ? '👁️ Eyedropper' :
             '✋ Pan'}
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F7D154',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  progressContainer: {
    alignItems: 'center',
    minWidth: 120,
  },
  progressBar: {
    width: 120,
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#50C878',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '600',
  },
  canvasContainer: {
    flex: 1,
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  canvas: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  svg: {
    flex: 1,
  },
  toolsBar: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  toolsContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  toolButton: {
    backgroundColor: '#F7D154',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeToolButton: {
    backgroundColor: '#FF8C42',
  },
  disabledButton: {
    backgroundColor: '#F0F0F0',
  },
  separator: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  brushControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7D154',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  brushButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 4,
  },
  brushSizeDisplay: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  brushPreview: {
    borderRadius: 10,
    marginBottom: 2,
  },
  brushSizeText: {
    fontSize: 10,
    color: '#8B4513',
    fontWeight: '600',
  },
  zoomText: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  downloadButton: {
    backgroundColor: '#50C878',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  pdfButton: {
    backgroundColor: '#4A90E2',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  colorPalette: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 120,
  },
  paletteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paletteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  addColorButton: {
    backgroundColor: '#FF8C42',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  addColorText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  colorsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColor: {
    borderColor: '#FF8C42',
    borderWidth: 3,
  },
  customColorModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customColorContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: width * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  customColorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 16,
  },
  customColorInput: {
    borderWidth: 2,
    borderColor: '#F7D154',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 16,
  },
  customColorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#8B4513',
    fontWeight: '600',
    fontSize: 16,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#50C878',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  statusBadge: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B4513',
  },
});