export const CANVAS_W = 1280;
export const CANVAS_H = 720;
export const CEILING_Y = 40;
export const GROUND_Y = 660;
export const GROUND_H = CANVAS_H - GROUND_Y;
export const PLAYER_W = 48;
export const PLAYER_H = 64;
export const PLAYER_START_X = 180;
export const PLAYER_START_Y = GROUND_Y - PLAYER_H;
export const GRAVITY = 0.4;
export const THRUST = -0.92;
export const TERMINAL_VELOCITY_DOWN = 8;
export const TERMINAL_VELOCITY_UP = -7.5;
export const BASE_SCROLL_SPEED = 3.4;
export const MAX_SCROLL_SPEED = 7.2;
export const SPEED_RAMP_DISTANCE = 9000;
export const PINCH_THRESHOLD = 45;
export const PINCH_HYSTERESIS = 12;
export const MEDIAPIPE_MAX_HANDS = 1;
export const HAND_LOST_THRESHOLD_MS = 500;
export const FIXED_FRAME_MS = 1000 / 60;
export const COUNTDOWN_STEPS = ["3", "2", "1", "GO!"];
export const COUNTDOWN_STEP_MS = 700;
export const CALIBRATION_PINCH_HOLD_MS = 550;
export const CALIBRATION_READY_MS = 650;
export const TITLE_PINCH_HOLD_MS = 280;
export const RESULTS_PINCH_DELAY_MS = 1200;
export const DEATH_FLASH_MS = 140;
export const DEATH_TUMBLE_MS = 850;
export const DEATH_SLIDE_DECEL = 0.28;
export const PLAYER_DEATH_VX = 7;
export const PLAYER_DEATH_VY = -4.4;
export const PLAYER_ROTATION_SPEED = 0.18;
export const PLAYER_MAX_ROTATION = Math.PI * 1.2;
export const PLAYER_THRUST_RAMP_UP = 0.21;
export const PLAYER_THRUST_RAMP_DOWN = 0.11;
export const FLAME_THRESHOLD = 0.18;
export const FIRST_RUN_HINT_DELAY_MS = 2000;
export const ZAPPER_FIRST_SPAWN_DISTANCE = 760;
export const OBSTACLE_DIFFICULTY_RAMP_DISTANCE = 4200;
export const ZAPPER_MIN_SPACING_EASY = 520;
export const ZAPPER_MAX_SPACING_EASY = 760;
export const ZAPPER_MIN_SPACING_HARD = 360;
export const ZAPPER_MAX_SPACING_HARD = 560;
export const ZAPPER_MIN_LENGTH_EASY = 140;
export const ZAPPER_MAX_LENGTH_EASY = 210;
export const ZAPPER_MIN_LENGTH_HARD = 170;
export const ZAPPER_MAX_LENGTH_HARD = 250;
export const ZAPPER_THICKNESS = 18;
export const ZAPPER_END_CAP_RADIUS = 18;
export const ZAPPER_COLLISION_PAD = 6;
export const ZAPPER_ALLOWED_ANGLES = [0, 45, 90, 135];
export const ZAPPER_MIN_CENTER_Y = 160;
export const ZAPPER_MAX_CENTER_Y = 500;
export const INGREDIENT_RADIUS = 10;
export const INGREDIENT_PATTERN_SPACING = 38;
export const INGREDIENT_ZIGZAG_STEP = 26;
export const INGREDIENT_ARC_HEIGHT = 54;
export const INGREDIENT_PATTERN_COUNT = 6;
export const INGREDIENT_PATTERN_GRID_ROWS = 2;
export const INGREDIENT_PATTERN_GRID_COLS = 4;
export const INGREDIENT_AVOIDANCE_Y = 120;
export const INGREDIENT_PICKUP_PAD = 6;
export const DISTANCE_SCALE = 0.14;
export const BACKGROUND_STRIPE_SPEED = 0.35;
export const BACKGROUND_STRIPE_COUNT = 14;
export const GROUND_MARKER_COUNT = 18;
export const HUD_PADDING = 28;
export const PANEL_RADIUS = 18;
export const WEBCAM_PIP_W = 246;
export const WEBCAM_PIP_H = 184;
export const WEBCAM_TITLE_W = 420;
export const WEBCAM_TITLE_H = 280;
export const HAND_CONNECTIONS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [0, 17],
];
export const HAND_LANDMARK_INDEX = {
  WRIST: 0,
  THUMB_TIP: 4,
  INDEX_FINGER_TIP: 8,
};

export const GAME_STATES = Object.freeze({
  LOADING: "LOADING",
  TITLE: "TITLE",
  CALIBRATION: "CALIBRATION",
  COUNTDOWN: "COUNTDOWN",
  PLAY: "PLAY",
  DEAD: "DEAD",
  RESULTS: "RESULTS",
  RECIPE_WHEEL: "RECIPE_WHEEL",
  RETRY_PROMPT: "RETRY_PROMPT",
});
