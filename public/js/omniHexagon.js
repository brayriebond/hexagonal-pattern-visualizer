const SVG_NS = "http://www.w3.org/2000/svg";
const originalLineData = new Map(); 

export const BASE_LINE_IDS = [
    "border-p12-p2", "border-p2-p4", "border-p4-p6", "border-p6-p8", "border-p8-p10", "border-p10-p12",
    "spoke-c-p1", "spoke-c-p3", "spoke-c-p5", "spoke-c-p7", "spoke-c-p9", "spoke-c-p11",
    "spoke-c-p2", "spoke-c-p4", "spoke-c-p6", "spoke-c-p8", "spoke-c-p10", "spoke-c-p12"
];

let currentGlobalStrokeColor = '#000000'; 
let currentGlobalStrokeWidth = 1; // Default line weight

function getPointOnCircle(cx, cy, radius, angleDegrees) {
    const angleRadians = (angleDegrees - 90) * Math.PI / 180;
    return {
        x: cx + radius * Math.cos(angleRadians),
        y: cy + radius * Math.sin(angleRadians)
    };
}

function createLineElement(x1, y1, x2, y2, uniqueId, stroke, strokeWidth) {
    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("id", uniqueId);
    line.setAttribute("stroke", stroke); 
    line.setAttribute("stroke-width", strokeWidth); // Use passed stroke width
    originalLineData.set(uniqueId, { 
        originalP1: { x: x1, y: y1 }, 
        originalP2: { x: x2, y: y2 }, 
        baseStroke: stroke,
        baseStrokeWidth: strokeWidth 
    });
    return line;
}

function getPointAlongLine(p1, p2, ratio) {
    return {
        x: p1.x + (p2.x - p1.x) * ratio,
        y: p1.y + (p2.y - p1.y) * ratio
    };
}

export function updateLineLength(baseLineId, percentage) {
    originalLineData.forEach((data, uniqueLineId) => {
        if (uniqueLineId.endsWith(`-${baseLineId}`)) { 
            const lineElement = document.getElementById(uniqueLineId);
            if (!lineElement) return;

            const { originalP1, originalP2 } = data;
            const scale = percentage / 100;

            if (scale === 0) {
                const midX = (originalP1.x + originalP2.x) / 2;
                const midY = (originalP1.y + originalP2.y) / 2;
                lineElement.setAttribute("x1", midX);
                lineElement.setAttribute("y1", midY);
                lineElement.setAttribute("x2", midX);
                lineElement.setAttribute("y2", midY);
            } else {
                const gapRatio = (1 - scale) / 2;
                const newP1 = getPointAlongLine(originalP1, originalP2, gapRatio);
                const newP2 = getPointAlongLine(originalP2, originalP1, gapRatio);
                lineElement.setAttribute("x1", newP1.x);
                lineElement.setAttribute("y1", newP1.y);
                lineElement.setAttribute("x2", newP2.x);
                lineElement.setAttribute("y2", newP2.y);
            }
        }
    });
}

export function updateGlobalLineColor(newColor) {
    currentGlobalStrokeColor = newColor;
    originalLineData.forEach((data, uniqueLineId) => {
        const lineElement = document.getElementById(uniqueLineId);
        if (lineElement) {
            lineElement.setAttribute("stroke", newColor);
            data.baseStroke = newColor; 
        }
    });
}

/**
 * Updates the stroke width of all lines in the grid.
 * @param {number} newWeight - The new stroke width for the lines.
 */
export function updateGlobalLineWeight(newWeight) {
    currentGlobalStrokeWidth = newWeight;
    originalLineData.forEach((data, uniqueLineId) => {
        const lineElement = document.getElementById(uniqueLineId);
        if (lineElement) {
            lineElement.setAttribute("stroke-width", newWeight);
            data.baseStrokeWidth = newWeight;
        }
    });
}

export function drawHexagonGrid(svgContainer, hexRadius, viewBox, globalLineColor, globalLineWeight) {
    svgContainer.innerHTML = '';
    originalLineData.clear();
    currentGlobalStrokeColor = globalLineColor; 
    currentGlobalStrokeWidth = globalLineWeight;

    const hexWidth = hexRadius * Math.sqrt(3);
    const hexHeight = hexRadius * 2;
    const vertSpacing = hexHeight * 0.75;
    const horizSpacing = hexWidth;

    const primeHexCenterX = viewBox.x + viewBox.width / 2;
    const primeHexCenterY = viewBox.y + viewBox.height / 2;

    const numColsHalf = Math.ceil((viewBox.width / 2 / horizSpacing));
    const numRowsHalf = Math.ceil((viewBox.height / 2 / vertSpacing));

    for (let gridR = -numRowsHalf; gridR <= numRowsHalf; gridR++) {
        for (let gridC = -numColsHalf; gridC <= numColsHalf; gridC++) {
            let currentHexCenterX = primeHexCenterX + gridC * horizSpacing;
            const currentHexCenterY = primeHexCenterY + gridR * vertSpacing;

            if (gridR % 2 !== 0) {
                currentHexCenterX += horizSpacing / 2;
            }
            
            const cornerRadius = hexRadius;
            const edgeMidpointRadius = hexRadius * (Math.sqrt(3) / 2);

            const p12 = getPointOnCircle(currentHexCenterX, currentHexCenterY, cornerRadius, 0);
            const p2 = getPointOnCircle(currentHexCenterX, currentHexCenterY, cornerRadius, 60);
            const p4 = getPointOnCircle(currentHexCenterX, currentHexCenterY, cornerRadius, 120);
            const p6 = getPointOnCircle(currentHexCenterX, currentHexCenterY, cornerRadius, 180);
            const p8 = getPointOnCircle(currentHexCenterX, currentHexCenterY, cornerRadius, 240);
            const p10 = getPointOnCircle(currentHexCenterX, currentHexCenterY, cornerRadius, 300);
            const corners = { p12, p2, p4, p6, p8, p10 };

            const p1 = getPointOnCircle(currentHexCenterX, currentHexCenterY, edgeMidpointRadius, 30);
            const p3 = getPointOnCircle(currentHexCenterX, currentHexCenterY, edgeMidpointRadius, 90);
            const p5 = getPointOnCircle(currentHexCenterX, currentHexCenterY, edgeMidpointRadius, 150);
            const p7 = getPointOnCircle(currentHexCenterX, currentHexCenterY, edgeMidpointRadius, 210);
            const p9 = getPointOnCircle(currentHexCenterX, currentHexCenterY, edgeMidpointRadius, 270);
            const p11 = getPointOnCircle(currentHexCenterX, currentHexCenterY, edgeMidpointRadius, 330);
            const edges = { p1, p3, p5, p7, p9, p11 };
            
            const center = { x: currentHexCenterX, y: currentHexCenterY };

            const addLineToSvg = (p_1, p_2, baseId) => {
                const uniqueId = `hex-${gridR}-${gridC}-${baseId}`;
                svgContainer.appendChild(createLineElement(p_1.x, p_1.y, p_2.x, p_2.y, uniqueId, currentGlobalStrokeColor, currentGlobalStrokeWidth));
            };

            BASE_LINE_IDS.forEach((baseId, index) => {
                if (index < 6) { 
                    const c1 = corners[Object.keys(corners)[index % 6]];
                    const c2 = corners[Object.keys(corners)[(index + 1) % 6]];
                    addLineToSvg(c1, c2, baseId);
                } else if (index < 12) { 
                    const edge = edges[Object.keys(edges)[(index - 6) % 6]];
                    addLineToSvg(center, edge, baseId);
                } else { 
                    let cornerKeyIndex;
                    switch(baseId) {
                        case "spoke-c-p2": cornerKeyIndex = 1; break;
                        case "spoke-c-p4": cornerKeyIndex = 2; break;
                        case "spoke-c-p6": cornerKeyIndex = 3; break;
                        case "spoke-c-p8": cornerKeyIndex = 4; break;
                        case "spoke-c-p10": cornerKeyIndex = 5; break;
                        case "spoke-c-p12": cornerKeyIndex = 0; break;
                        default: break;
                    }
                    if (cornerKeyIndex !== undefined) {
                         const actualCorner = corners[Object.keys(corners)[cornerKeyIndex]];
                         addLineToSvg(center, actualCorner, baseId);
                    }
                }
            });
        }
    }
    return BASE_LINE_IDS;
}

export function getLineColor() {
    return currentGlobalStrokeColor;
}

export function getLineWeight() {
    return currentGlobalStrokeWidth;
}
